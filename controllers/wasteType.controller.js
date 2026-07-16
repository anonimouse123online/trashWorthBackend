const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/** GET /api/waste-types */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_types')
      .select('*')
      .order('name');
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Waste types fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/waste-types/:id */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_types')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return errorResponse(res, 'Waste type not found', 404);
    return successResponse(res, 'Waste type fetched', data);
  } catch (error) { next(error); }
};

/** POST /api/waste-types */
const create = async (req, res, next) => {
  try {
    const { name, description, incentive_rate_per_kg, status } = req.body;
    const { data, error } = await supabase
      .from('waste_types')
      .insert({ name, description, incentive_rate_per_kg, status })
      .select()
      .single();
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Waste type created', data, 201);
  } catch (error) { next(error); }
};

/** PUT /api/waste-types/:id */
const update = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('waste_types')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Waste type updated', data);
  } catch (error) { next(error); }
};

/** DELETE /api/waste-types/:id */
const remove = async (req, res, next) => {
  try {
    const { error } = await supabase.from('waste_types').delete().eq('id', req.params.id);
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Waste type deleted');
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
