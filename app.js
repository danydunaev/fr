const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Хранилище товаров (в реальном проекте использовалась бы база данных)
let products = [
  { id: 1, название: 'Разнорабочий', стоимость: 0 },
  { id: 2, название: 'Смартфон Galaxy X Pro', стоимость: 29990 },
  { id: 3, название: 'Ноутбук MacBook Pro', стоимость: 149990 }
];

let nextId = 4;

// GET / - Главная страница
app.get('/', (req, res) => {
  res.send('API для управления товарами. Доступные эндпоинты: GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id');
});

// GET /api/products - Получить все товары
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products,
    count: products.length
  });
});

// GET /api/products/:id - Получить товар по id
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Товар с id ${id} не найден`
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// POST /api/products - Добавить новый товар
app.post('/api/products', (req, res) => {
  const { название, стоимость } = req.body;
  
  // Валидация
  if (!название || стоимость === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Необходимо указать название и стоимость товара'
    });
  }
  
  if (typeof стоимость !== 'number' || стоимость < 0) {
    return res.status(400).json({
      success: false,
      message: 'Стоимость должна быть неотрицательным числом'
    });
  }
  
  const newProduct = {
    id: nextId++,
    название,
    стоимость
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Товар успешно добавлен',
    data: newProduct
  });
});

// PUT /api/products/:id - Редактировать товар
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { название, стоимость } = req.body;
  
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Товар с id ${id} не найден`
    });
  }
  
  // Валидация
  if (стоимость !== undefined && (typeof стоимость !== 'number' || стоимость < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Стоимость должна быть неотрицательным числом'
    });
  }
  
  // Обновление полей
  if (название !== undefined) {
    products[productIndex].название = название;
  }
  if (стоимость !== undefined) {
    products[productIndex].стоимость = стоимость;
  }
  
  res.json({
    success: true,
    message: 'Товар успешно обновлён',
    data: products[productIndex]
  });
});

// DELETE /api/products/:id - Удалить товар
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Товар с id ${id} не найден`
    });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Товар успешно удалён',
    data: deletedProduct
  });
});

app.listen(port, () => {
  console.log(`API сервер запущен на http://localhost:${port}`);
  console.log(`Доступные эндпоинты:`);
  console.log(`  GET    http://localhost:${port}/api/products - Все товары`);
  console.log(`  GET    http://localhost:${port}/api/products/:id - Товар по id`);
  console.log(`  POST   http://localhost:${port}/api/products - Добавить товар`);
  console.log(`  PUT    http://localhost:${port}/api/products/:id - Обновить товар`);
  console.log(`  DELETE http://localhost:${port}/api/products/:id - Удалить товар`);
});