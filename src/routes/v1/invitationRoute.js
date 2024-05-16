import express from 'express';
import { invitationController } from '~/controllers/invitationController';
import { validateCreateInvitation } from '~/validations/invitationValidation';

const Router = express.Router();

Router.post('/', validateCreateInvitation, invitationController.createInvitation);
Router.get('/invited/:invitedUserId', invitationController.getInvitationsByUserId);
Router.patch('/:id/accept', invitationController.acceptInvitation);
Router.patch('/:id/decline', invitationController.declineInvitation);
export const invitationRoute = Router;
