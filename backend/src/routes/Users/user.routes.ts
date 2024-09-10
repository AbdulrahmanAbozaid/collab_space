import { Router } from "express";
import * as userController from "../../controllers/userController";
import { authorize } from "../../utils/auth";

const router = Router();

// Admin routes (for managing users)
router.route("/").all(authorize).get(userController.getAllUsers);

router
  .route("/:id")
  .all(authorize)
  .get(userController.getUser) 
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/me')
    .all(authorize)
    .get(userController.getUser)
    .put(userController.updateMe)
    .delete(userController.deleteMe)

export default router;
