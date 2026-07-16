const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { generateQrToken } = require('../utils/generateQrToken');

/**
 * GET /api/households
 */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('households')
      .select(`
        *, 
        resident:profiles!resident_user_id(id, first_name, last_name, role), 
        registrar:profiles!registered_by(id, first_name, last_name, role)
      `)
      .order('created_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Households fetched', data);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/households/:id
 */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('households')
      .select(`
        *, 
        resident:profiles!resident_user_id(id, first_name, last_name), 
        registrar:profiles!registered_by(id, first_name, last_name)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) return errorResponse(res, 'Household not found', 404);
    return successResponse(res, 'Household fetched', data);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/households
 * Create a new household and generate its QR token + code
 */
const create = async (req, res, next) => {
  try {
    const {
      resident_user_id, household_code, household_name, head_of_household,
      number_of_members, street_address, barangay, city, zip_code,
      primary_contact, alternate_contact, email
    } = req.body;

    // Generate unique QR token and image
    const { token, qrCodeDataUrl } = await generateQrToken('HH-');

    // Defensive check for registered_by: must be a valid UUID format (sub or id)
    const userId = req.user?.id || req.user?.sub;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const registeredBy = (userId && uuidRegex.test(userId)) ? userId : null;

    const { data, error } = await supabase
      .from('households')
      .insert({
        resident_user_id,
        household_code,
        household_name,
        head_of_household,
        number_of_members,
        street_address,
        barangay,
        city,
        zip_code,
        primary_contact,
        alternate_contact,
        email,
        qr_token: token,
        qr_code_url: qrCodeDataUrl,
        registered_by: registeredBy
      })
      .select()
      .single();

    if (error) {
      console.error('=== Supabase INSERT households Error ===');
      console.error('Full error object:', error);
      console.error('error.code   :', error.code);
      console.error('error.message:', error.message);
      console.error('error.details:', error.details);
      console.error('error.hint   :', error.hint);
      return errorResponse(res, error.message, 400);
    }
    return successResponse(res, 'Household created', data, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/households/:id
 */
const update = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('households')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Household updated', data);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/households/:id
 */
const remove = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('households')
      .delete()
      .eq('id', req.params.id);

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Household deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/households/:id/qr
 * Regenerate QR token for a household
 */
const regenerateQr = async (req, res, next) => {
  try {
    const { token, qrCodeDataUrl } = await generateQrToken('HH-');

    const { data, error } = await supabase
      .from('households')
      .update({ qr_token: token, qr_code_url: qrCodeDataUrl, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select('id, household_code, qr_token, qr_code_url')
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'QR code regenerated', data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, regenerateQr };
