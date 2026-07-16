const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/** GET /api/announcements */
const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*, profiles(id, first_name, last_name)')
      .order('created_at', { ascending: false });
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Announcements fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/announcements/:id */
const getById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*, profiles(id, first_name, last_name)')
      .eq('id', req.params.id)
      .single();
    if (error) return errorResponse(res, 'Announcement not found', 404);
    return successResponse(res, 'Announcement fetched', data);
  } catch (error) { next(error); }
};

/** POST /api/announcements */
const create = async (req, res, next) => {
  try {
    const { title, content, audience, status, expires_at } = req.body;
    const staffId = req.user?.sub ?? null;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title, content, audience,
        status: status || 'draft',
        published_by: status === 'published' ? staffId : null,
        published_at: status === 'published' ? now : null,
        expires_at
      })
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Announcement created', data, 201);
  } catch (error) { next(error); }
};

/** PUT /api/announcements/:id */
const update = async (req, res, next) => {
  try {
    const { status } = req.body;
    const staffId = req.user?.sub ?? null;
    const now = new Date().toISOString();

    const updates = { ...req.body, updated_at: now };
    if (status === 'published') {
      updates.published_by = staffId;
      updates.published_at = now;
    }

    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Announcement updated', data);
  } catch (error) { next(error); }
};

/** DELETE /api/announcements/:id */
const remove = async (req, res, next) => {
  try {
    const { error } = await supabase.from('announcements').delete().eq('id', req.params.id);
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Announcement deleted');
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
