const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { calculateIncentive } = require('../utils/calculateIncentive');

/** GET /api/submissions */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_submissions')
      .select(`
        *,
        households(id, household_code, household_name),
        waste_types(id, name, incentive_rate_per_kg),
        profiles(id, first_name, last_name)
      `)
      .order('submitted_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Submissions fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/submissions/:id */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_submissions')
      .select(`
        *,
        households(id, household_code, household_name),
        waste_types(id, name, incentive_rate_per_kg),
        profiles(id, first_name, last_name)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) return errorResponse(res, 'Submission not found', 404);
    return successResponse(res, 'Submission fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/submissions/household/:householdId */
const getByHousehold = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_submissions')
      .select('*, waste_types(id, name, incentive_rate_per_kg)')
      .eq('household_id', req.params.householdId)
      .order('submitted_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Household submissions fetched', data);
  } catch (error) { next(error); }
};

/** POST /api/submissions */
const create = async (req, res, next) => {
  try {
    const {
      submission_code, household_id, waste_type_id,
      weight_kg, collection_date, status
    } = req.body;

    // Fetch incentive rate for the waste type
    const { data: wasteType, error: wtError } = await supabase
      .from('waste_types')
      .select('incentive_rate_per_kg, name')
      .eq('id', waste_type_id)
      .single();

    if (wtError) return errorResponse(res, 'Invalid waste type', 400);

    const incentive_amount = +(wasteType.incentive_rate_per_kg * weight_kg).toFixed(2);

    const { data, error } = await supabase
      .from('waste_submissions')
      .insert({
        submission_code,
        household_id,
        staff_id: req.user?.sub ?? null,
        waste_type_id,
        weight_kg,
        incentive_amount,
        status: status || 'approved',
        collection_date,
        approved_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Submission recorded', data, 201);
  } catch (error) { next(error); }
};

/** PUT /api/submissions/:id */
const update = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_submissions')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Submission updated', data);
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, getByHousehold, create, update };
