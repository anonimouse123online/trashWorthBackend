const { supabase, supabaseAdmin } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * GET /api/profiles
 * List all profiles (admin/staff only)
 */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Profiles fetched', data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/profiles/:id
 */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return errorResponse(res, 'Profile not found', 404);
    return successResponse(res, 'Profile fetched', data);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profiles/:id
 * Update a profile
 */
const update = async (req, res, next) => {
  try {
    const { first_name, middle_name, last_name, contact_number, profile_photo_url, role, status } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ first_name, middle_name, last_name, contact_number, profile_photo_url, role, status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Profile updated', data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, update };
