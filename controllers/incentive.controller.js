const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');


const getAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('incentive_transactions')
      .select('*, households(id, household_code, household_name), profiles(id, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Incentive transactions fetched', data);
  } catch (error) { next(error); }
};

/** GET /api/incentives/household/:householdId */
const getByHousehold = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('incentive_transactions')
      .select('*')
      .eq('household_id', req.params.householdId)
      .order('created_at', { ascending: false });

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Household incentives fetched', data);
  } catch (error) { next(error); }
};

/**
 * GET /api/incentives/balance/:householdId
 * Returns the current total balance for a household
 */
const getBalance = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('incentive_transactions')
      .select('amount, transaction_type')
      .eq('household_id', req.params.householdId);

    if (error) return errorResponse(res, error.message, 400);

    const balance = data.reduce((acc, tx) => {
      if (tx.transaction_type === 'credit') return acc + Number(tx.amount);
      if (tx.transaction_type === 'debit') return acc - Number(tx.amount);
      return acc; // adjustment already reflects net
    }, 0);

    return successResponse(res, 'Balance calculated', {
      household_id: req.params.householdId,
      balance: +balance.toFixed(2)
    });
  } catch (error) { next(error); }
};

/** POST /api/incentives (manual credit/debit/adjustment) */
const create = async (req, res, next) => {
  try {
    const { household_id, transaction_type, amount, source_type, source_id, description, balance_after } = req.body;

    const { data, error } = await supabase
      .from('incentive_transactions')
      .insert({
        household_id, transaction_type, amount, source_type, source_id,
        description, balance_after, created_by: req.user?.sub ?? null
      })
      .select()
      .single();

    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Incentive transaction recorded', data, 201);
  } catch (error) { next(error); }
};

module.exports = { getAll, getByHousehold, getBalance, create };
