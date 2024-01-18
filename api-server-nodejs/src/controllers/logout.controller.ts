import ActiveSession from '../models/user/activeSession';
import { connection } from '../server/database';

export const logoutUser = (req: any, res: any) => {
    const { token } = req.body;
    const activeSessionRepository = connection!.getMongoRepository(ActiveSession);
  
    activeSessionRepository.delete({ token })
      .then(() => res.json({ success: true }))
      .catch(() => {
        res.json({ success: false, msg: 'Token revoked' });
      });
  }