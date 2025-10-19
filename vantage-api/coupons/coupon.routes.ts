import { Router } from "express";
import { authorize, adminAuth } from "@/middlewares/authorize";
import {
  validateCouponHandler,
  createCouponHandler,
  getCouponsHandler,
  getCouponHandler,
  updateCouponHandler,
  deactivateCouponHandler,
  getCouponStatsHandler,
  generateCouponCodeHandler,
  getAutoApplicableCouponsHandler,
  findBestAutoCouponHandler,
} from "./coupon.controller";

const router = Router();

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

/**
 * @route POST /api/coupons/validate
 * @desc Validate a coupon code
 * @access Public
 */
router.post("/validate", validateCouponHandler);

/**
 * @route GET /api/coupons
 * @desc Get all active coupons
 * @access Public
 */
router.get("/", getCouponsHandler);

/**
 * @route GET /api/coupons/:code
 * @desc Get coupon by code
 * @access Public
 */
router.get("/:code", getCouponHandler);

/**
 * @route POST /api/coupons/auto-applicable
 * @desc Get all auto-applicable coupons for given conditions (SECURE)
 * @access Public
 */
router.post("/auto-applicable", getAutoApplicableCouponsHandler);

/**
 * @route POST /api/coupons/auto-applicable/best
 * @desc Find the best auto-applicable coupon for given conditions (SECURE)
 * @access Public
 */
router.post("/auto-applicable/best", findBestAutoCouponHandler);

// ============================================================================
// ADMIN ROUTES (Admin authentication required)
// ============================================================================

/**
 * @route POST /api/coupons
 * @desc Create a new coupon
 * @access Admin
 */
router.post("/", authorize(), adminAuth, createCouponHandler);

/**
 * @route PUT /api/coupons/:code
 * @desc Update coupon
 * @access Admin
 */
router.put("/:code", authorize(), adminAuth, updateCouponHandler);

/**
 * @route DELETE /api/coupons/:code
 * @desc Deactivate coupon
 * @access Admin
 */
router.delete("/:code", authorize(), adminAuth, deactivateCouponHandler);

/**
 * @route GET /api/coupons/:code/stats
 * @desc Get coupon statistics
 * @access Admin
 */
router.get("/:code/stats", authorize(), adminAuth, getCouponStatsHandler);

/**
 * @route POST /api/coupons/generate-code
 * @desc Generate unique coupon code
 * @access Admin
 */
router.post(
  "/generate-code",
  authorize(),
  adminAuth,
  generateCouponCodeHandler
);

// ============================================================================
// ROUTE DOCUMENTATION
// ============================================================================

/**
 * Coupon API Routes Overview:
 *
 * PUBLIC ROUTES:
 * - POST /validate - Validate a coupon code
 * - GET / - Get all active coupons
 * - GET /:code - Get coupon by code
 * - POST /auto-applicable - Get all auto-applicable coupons (SECURE)
 * - POST /auto-applicable/best - Find best auto-applicable coupon (SECURE)
 *
 * ADMIN ROUTES:
 * - POST / - Create a new coupon
 * - PUT /:code - Update coupon
 * - DELETE /:code - Deactivate coupon
 * - GET /:code/stats - Get coupon statistics
 * - POST /generate-code - Generate unique coupon code
 */

export default router;
