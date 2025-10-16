import { Router } from "express";
import {
  deleteProgram,
  getProgramBySlug,
  listPrograms,
  upsertProgram,
  getProgramByProgramId,
} from "./courses.controller";

const router = Router();

router.get("/", listPrograms);
router.get("/:slug", getProgramBySlug);
router.get("/id/:programId", getProgramByProgramId);
router.put("/:slug", upsertProgram);
router.delete("/:slug", deleteProgram);

export default router;
