const brandModel = require('../models/model.brand');

class BrandController {
  async index(req, res) {
    try {
      const brands = await brandModel.find();
      return res.status(200).json({ status: true, brands });
    } catch (error) {
      return res.status(400).json({ status: false, error });
    }
  }
  async detail(req, res) {
    const { id: brandId } = req.params;
    try {
      const brand = await brandModel.find({ brand: brandId });
      if (!brand.length) {
        return res.status(400).json({
          status: false,
          message: 'No product founded by brand id!',
        });
      }
      return res.status(200).json({
        status: true,
        message: 'Get brand detail successfully!',
        brand,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: 'Error when get brands detail!' });
    }
  }

  // Admin
  async adminGetList(req, res) {
    try {
      const brands = await brandModel.find();

      if (brands.length > 0) {
        return res.status(200).render('template/brand/list', {
          brands,
          message: '',
        });
      } else {
        return res.status(400).render('template/brand/list', {
          brands,
          message: 'Không tìm thấy thương hiệu!',
        });
      }
    } catch (error) {
      return res.status(500).render('template/brand/list', {
        brands: {},
        message: 'Không tìm thấy thương hiệu!',
      });
    }
  }
  async adminGetAdd(req, res) {
    res.status(200).render('template/brand/add', { message: '' });
  }
  async adminDeleteOne(req, res) {
    const { id } = req.params;
    try {
      await brandModel.deleteOne({ _id: id });
      res.redirect('/brand-manager/list');
    } catch (error) {
      res.redirect('/brand-manager/list');
    }
  }
  async adminGetUpdate(req, res) {
    try {
      const { id } = req.query;
      const brand = await brandModel.findById(id);
      return res.status(200).render('template/brand/edit', {
        brand,
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
      return res.status(302).redirect('/brand-manager/list');
    }
    const brand = { name, slug };
    try {
      await brandModel.updateOne({ _id: id }, brand);
      return res.status(302).redirect('/brand-manager/list');
    } catch (error) {
      return res.status(302).redirect('/brand-manager/list');
    }
  }
  async adminPostAdd(req, res) {
    const { name, slug } = req.body;

    if (!(name || slug)) {
      res.status(500).render('template/brand/add', {
        message: 'Vui lòng điền tất cả các field!',
      });
    }
    try {
      const brandExist = await brandModel.find({ name });
      if (brandExist.length > 0) {
        return res.status(500).render('template/brand/add', {
          message: 'Tên danh mục đã tồn tại!',
        });
      }
      const brand = new brandModel({
        name,
        slug,
      });
      console.log(
        '🚀 ~ file: controller.brand.js ~ line 118 ~ BrandController ~ adminPostAdd ~ brand',
        brand
      );

      const status = await brandModel.create(brand);

      return res.status(202).redirect('/brand-manager/list');
    } catch (error) {
      return res.status(202).redirect('/brand-manager/list');
    }
  }
}

module.exports = new BrandController();
