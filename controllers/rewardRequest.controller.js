const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/** GET /api/reward-requests */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('reward_requests')
      .select(`
        *,
        households(id, household_code, household_name),
        rewards(id, reward_code, name, required_points)
      `)
      .order('requested_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Reward requests fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/reward-requests/:id */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('reward_requests')
      .select('*, households(*), rewards(*)')
      .eq('id', req.params.id)
      .single();
    if (error) return errorResponse(res, 'Reward request not found', 404);
    return successResponse(res, 'Reward request fetched', data);
  } catch (error) { next(error); }
};

/** POST /api/reward-requests */
const create = async (req, res, next) => {
  try {
    const { request_code, household_id, reward_id, quantity, points_used } = req.body;

    const { data, error } = await supabase
      .from('reward_requests')
      .insert({ request_code, household_id, reward_id, quantity, points_used, status: 'pending' })
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Reward request submitted', data, 201);
  } catch (error) { next(error); }
};

/**
 * PATCH /api/reward-requests/:id/status
 * Update status: pending → approved → released | rejected | cancelled
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status, rejection_reason } = req.body;
    const staffId = req.user?.sub ?? null;
    const now = new Date().toISOString();

    const updates = { status, updated_at: now };
    if (status === 'approved')  { updates.approved_by = staffId; updates.approved_at = now; }
    if (status === 'released')  { updates.released_by = staffId; updates.released_at = now; }
    if (status === 'rejected')  { updates.rejection_reason = rejection_reason; }

    const { data, error } = await supabase
      .from('reward_requests')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, `Reward request ${status}`, data);
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, updateStatus };
