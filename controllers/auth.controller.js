const { supabase } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminCreds = email === 'admin@gmail.com' && password === 'admin123';
    if (adminCreds && process.env.NODE_ENV !== 'production') {
      const mockUserId = '1fd1f526-06a9-4fad-905d-a2be8de16f36';
      const dummyToken = jwt.sign(
        {
          id: mockUserId,
          sub: mockUserId,
          email,
          role: 'admin'
        },
        process.env.JWT_SECRET || 'dev-secret-key',
        { expiresIn: '24h' }
      );
      return successResponse(res, 'Login successful (mock)', {
        token: dummyToken,
        user: {
          id: mockUserId,
          email,
          role: 'admin',
          fullName: 'Admin User'
        }
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return errorResponse(res, error.message, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, status')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return successResponse(res, 'Login successful', {
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: 'resident'
        }
      });
    }

    if (profile.status === 'suspended' || profile.status === 'inactive') {
      await supabase.auth.signOut();
      return errorResponse(res, 'Your account has been suspended or deactivated. Contact an administrator.', 403);
    }

    return successResponse(res, 'Login successful', {
      token: data.session.access_token,
      user: {
        id: profile.id,
        email: data.user.email,
        fullName: `${profile.first_name} ${profile.last_name}`,
        role: profile.role,
        status: profile.status
      }
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return errorResponse(res, error.message, 400);
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
const me = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.sub)
      .single();

    if (error) return errorResponse(res, 'Profile not found', 404);
    return successResponse(res, 'Profile fetched', profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, me };
