const categoryModel = require('../models/model.category');
const productModel = require('../models/model.product');

class CategoryController {
  async index(req, res) {
    try {
      const categories = await categoryModel.find();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  async detail(req, res) {
    const { id: categoryId } = req.params;
    try {
      const products = await productModel.find({ category: categoryId });
      if (!products.length) {
        return res.status(400).json({
          status: false,
          message: 'No category founded by category id!',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Get category detail successfully!',
        products,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: 'Error when get category detail!' });
    }
  }

  // Admin
  async adminGetList(req, res) {
    try {
      const categories = await categoryModel.find();

      if (categories.length > 0) {
        return res.status(200).render('template/category/list', {
          categories,
          message: '',
        });
      } else {
        return res.status(400).render('template/category/list', {
          categories,
          message: 'Không tìm thấy sản phẩm',
        });
      }
    } catch (error) {
      return res.status(500).render('template/category/list', {
        categories: {},
        message: 'Không tìm thấy sản phẩm',
      });
    }
  }
  async adminGetAdd(req, res) {
    res.status(200).render('template/category/add', { message: '' });
  }
  async adminDeleteOne(req, res) {
    const { id } = req.params;
    try {
      await categoryModel.deleteOne({ _id: id });
      res.redirect('/category-manager/list');
    } catch (error) {
      res.redirect('/category-manager/list');
    }
  }
  async adminGetUpdate(req, res) {
    try {
      const { id } = req.query;
      const category = await categoryModel.findById(id);
      return res.status(200).render('template/category/edit', {
        category,
        message: '',
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  async adminPostUpdate(req, res) {
    const { name, slug } = req.body;
    const { id } = req.query;
    if (!id) {
      return res.status(302).redirect('/category-manager/list');
    }
    const category = { name, slug };
    try {
      await categoryModel.updateOne({ _id: id }, category);
      return res.status(302).redirect('/category-manager/list');
    } catch (error) {
      return res.status(302).redirect('/category-manager/list');
    }
  }
  async adminPostAdd(req, res) {
    const { name, slug } = req.body;
    if (!(name || slug)) {
      res.status(500).render('template/category/add', {
        message: 'Vui lòng điền tất cả các field!',
      });
    }
    try {
      const categoryExist = await categoryModel.find({ name });
      if (categoryExist.length > 0) {
        return res.status(500).render('template/category/add', {
          message: 'Tên danh mục đã tồn tại!',
        });
      }
      const category = new categoryModel({
        name,
        slug,
      });

      const status = await categoryModel.create(category);

      return res.status(202).redirect('/category-manager/list');
    } catch (error) {
      return res.status(202).redirect('/category-manager/list');
    }
  }
}

module.exports = new CategoryController();
