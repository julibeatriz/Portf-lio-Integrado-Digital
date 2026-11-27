import { Router } from "express";
import { listarAreas, cadastrarArea, editarArea, excluirArea, buscarAreaPorId } from "../controllers/areaController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = Router()

router.get("/", listarAreas)
router.post("/",verifyToken, verifyAdmin, cadastrarArea)
router.get("/:id",buscarAreaPorId)
router.put("/:id",verifyToken, verifyAdmin, editarArea)
router.delete("/:id",verifyToken, verifyAdmin, excluirArea)


export default router;