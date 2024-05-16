import { invitationService } from '~/services/invitationService';

const createInvitation = async (req, res) => {
  try {
    const invitation = await invitationService.createInvitation(req.body);
    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const invitation = await invitationService.acceptInvitation(req.params.id);
    res.status(200).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const declineInvitation = async (req, res) => {
  try {
    const invitation = await invitationService.declineInvitation(req.params.id);
    res.status(200).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInvitationsByUserId = async(req, res) => {
  try {
    const { invitedUserId } = req.params;
    const invitations = await invitationService.getInvitationsByUserId(invitedUserId);
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const invitationController = {
  createInvitation,
  acceptInvitation,
  declineInvitation,
  getInvitationsByUserId
};
