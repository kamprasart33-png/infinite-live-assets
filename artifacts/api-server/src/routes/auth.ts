import {
  GetCurrentAuthUserResponse,
  LoginMobileSessionResponse,
  LoginWithPasswordBody,
  LogoutMobileSessionResponse,
  RegisterUserBody,
} from '@workspace/api-zod';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { Router, type IRouter, type Request, type Response } from 'express';

import {
  clearSession,
  createSession,
  deleteSession,
  getSessionId,
  hashPassword,
  setSessionCookie,
  verifyPassword,
  type SessionData,
} from '../lib/auth';
import { requireAdmin } from '../middlewares/authMiddleware';

const router: IRouter = Router();

function toAuthUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
}

router.get('/auth/user', (req: Request, res: Response) => {
  res.json(
    GetCurrentAuthUserResponse.parse({
      user: req.isAuthenticated() ? req.user : null,
    }),
  );
});

router.post('/auth/login', async (req: Request, res: Response) => {
  const parsed = LoginWithPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Missing or invalid email/password' });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()));

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const sessionData: SessionData = { user: toAuthUser(user) };
  const sid = await createSession(sessionData);
  setSessionCookie(res, sid);

  res.json(GetCurrentAuthUserResponse.parse({ user: toAuthUser(user) }));
});

router.post('/auth/logout', async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  await clearSession(res, sid);
  res.json({ success: true });
});

// Admin-only: create a new staff/admin account. The very first admin
// account cannot be created through this route (there is no admin yet to
// authorize it) — use the create-admin script instead, once, after deploy.
router.post(
  '/auth/register',
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = RegisterUserBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Missing or invalid fields' });
      return;
    }
    const { email, password, firstName, lastName, role } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail));
    if (existing) {
      res.status(400).json({ error: 'An account with that email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(usersTable)
      .values({
        email: normalizedEmail,
        passwordHash,
        role: role ?? 'staff',
        firstName: firstName ?? null,
        lastName: lastName ?? null,
      })
      .returning();

    res.json(GetCurrentAuthUserResponse.parse({ user: toAuthUser(user) }));
  },
);

router.post('/mobile-auth/login', async (req: Request, res: Response) => {
  const parsed = LoginWithPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Missing or invalid email/password' });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()));

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const sessionData: SessionData = { user: toAuthUser(user) };
  const sid = await createSession(sessionData);
  res.json(LoginMobileSessionResponse.parse({ token: sid }));
});

router.post('/mobile-auth/logout', async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  if (sid) {
    await deleteSession(sid);
  }
  res.json(LogoutMobileSessionResponse.parse({ success: true }));
});

export default router;
