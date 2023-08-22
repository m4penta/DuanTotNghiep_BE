const productRouter = require('./api/router.product');
const categoryRouter = require('./api/router.category');
const commentRouter = require('./api/router.comment');
const commentRep = require('./api/router.commentRep');
const userRouter = require('./api/router.user');
const adminRootRouter = require('./admin/router.admin');
const adminProductRouter = require('./admin/route.product');
const orderRouter = require('./api/router.order');
const orderAdminRouter = require('./admin/router.order');
const adminCategoryRouter = require('./admin/route.category');
const adminBrandRouter = require('./admin/route.brand');
const userManagerRouter = require('./admin/router.user');
const visualizeRouter = require('./admin/router.visualize');
const adminCommentRouter = require('./admin/route.comment.js');
const adminAuth = require('../middlewares/adminAuth');

const initialApp = (app) => {
  // *** Site Route ***
  // User route
  app.use('/api/auth', userRouter); //register - login - update user FE
  // Product route
  app.use('/api', productRouter);
  // Category route
  app.use('/api/category', categoryRouter);
  // Comment route
  app.use('/api/comment', commentRouter);
  //order route
  app.use('/api/order', orderRouter);
 //reply
  app.use('/api/RepCmt', commentRep);
  // *** Admin Route ***
  app.use('/', adminRootRouter);

  // Dashboard Product
  app.use('/product-manager', adminAuth, adminProductRouter);

  // Dashboard category
  app.use('/category-manager', adminAuth, adminCategoryRouter);

  // Dashboard brand
  app.use('/brand-manager', adminAuth, adminBrandRouter);

  // User management
  app.use('/user-manager', adminAuth, userManagerRouter);

  // Visualize
  app.use('/visualize', adminAuth, visualizeRouter);
  //comment
  app.use('/comment-manager', adminAuth, adminCommentRouter);
 

  // Dashboard Order
  app.use('/order', adminAuth, orderAdminRouter);
};

module.exports = { init: initialApp };
