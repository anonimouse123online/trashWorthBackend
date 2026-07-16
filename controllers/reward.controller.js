const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/** GET /api/rewards */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .order('required_points');
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Rewards fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/rewards/:id */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return errorResponse(res, 'Reward not found', 404);
    return successResponse(res, 'Reward fetched', data);
  } catch (error) { next(error); }
};

/** POST /api/rewards */
const create = async (req, res, next) => {
  try {
    const { reward_code, name, description, required_points, stock_quantity, image_url, status } = req.body;
    const { data, error } = await supabase
      .from('rewards')
      .insert({ reward_code, name, description, required_points, stock_quantity, image_url, status })
      .select()
      .single();
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Reward created', data, 201);
  } catch (error) { next(error); }
};

/** PUT /api/rewards/:id */
const update = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Reward updated', data);
  } catch (error) { next(error); }
};

/** DELETE /api/rewards/:id */
const remove = async (req, res, next) => {
  try {
    const { error } = await supabase.from('rewards').delete().eq('id', req.params.id);
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Reward deleted');
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
