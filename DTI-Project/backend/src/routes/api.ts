import { Router } from 'express';
import {
  createProduct,
  createUser,
  getComplianceReport,
  getDashboard,
  getProductPerformance,
  getSalesMonitoring,
  getSalesReports,
  listAlerts,
  listAuditLogs,
  listConsignments,
  listPayments,
  listProducts,
  listSales,
  listUsers,
  recordSale,
  submitPayment,
  toggleUserStatus,
} from '../controllers/apiController';

const router = Router();

router.get('/dashboard', getDashboard);
router.get('/reports/sales', getSalesReports);
router.get('/reports/performance', getProductPerformance);
router.get('/reports/monitoring', getSalesMonitoring);
router.get('/reports/compliance', getComplianceReport);
router.get('/alerts', listAlerts);
router.get('/audit-logs', listAuditLogs);

router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id/status', toggleUserStatus);

router.get('/products', listProducts);
router.post('/products', createProduct);

router.get('/consignments', listConsignments);

router.get('/sales/recent', listSales);
router.post('/sales', recordSale);

router.get('/payments', listPayments);
router.post('/payments', submitPayment);

export default router;
