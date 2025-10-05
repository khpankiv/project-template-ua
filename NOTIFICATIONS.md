# 🔔 Система сповіщень проекту

## Огляд

Комплексна система сповіщень для веб-додатка з підтримкою різних типів повідомлень:
- **Popup сповіщення** - детальні з заголовком та описом
- **Toast сповіщення** - швидкі короткі повідомлення
- **Inline сповіщення** - валідація форм в реальному часі
- **Спеціалізовані сповіщення** - для кошика та пошуку

## Використання

### Базове підключення
```javascript
import notificationManager from './notifications.js';
```

### Popup сповіщення
```javascript
// Успіх
notificationManager.showPopup('success', 'Заголовок', 'Опис операції');

// Помилка  
notificationManager.showPopup('error', 'Помилка!', 'Опис помилки');

// Попередження
notificationManager.showPopup('warning', 'Увага!', 'Важлива інформація');

// Інформація
notificationManager.showPopup('info', 'Інфо', 'Корисна інформація');
```

### Toast сповіщення
```javascript
// Швидкі повідомлення (зникають автоматично)
notificationManager.showToast('success', 'Дані збережено!');
notificationManager.showToast('error', 'Помилка з\'єднання');
```

### Валідація форм
```javascript
// Показати помилку валідації
notificationManager.showFormValidation(inputElement, false, 'Поле обов\'язкове');

// Показати успішну валідацію
notificationManager.showFormValidation(inputElement, true);

// Приховати сповіщення
notificationManager.hideInlineNotification(inputElement);
```

### Сповіщення кошика
```javascript
// Товар додано
notificationManager.showCartNotification('product-added', 'Назва товару');

// Кошик очищено
notificationManager.showCartNotification('cart-cleared');

// Успішна покупка
notificationManager.showCartNotification('checkout-success');

// Товар не знайдено
notificationManager.showCartNotification('product-not-found');
```

## Типи сповіщень

### Popup (детальні)
- Позиція: верхній правий кут
- Тривалість: 5 секунд (налаштовується)
- Містить: іконку, заголовок, опис, кнопку закриття
- Типи: success, error, warning, info

### Toast (швидкі)
- Позиція: знизу по центру
- Тривалість: 3 секунди
- Містить: тільки текст повідомлення
- Типи: success, error, warning, info

### Inline (валідація)
- Позиція: праворуч від поля форми
- Тривалість: до виправлення помилки
- Містить: текст помилки
- Автоматично змінює стилі поля

## CSS класи

### Стани полів форм
```css
.error   /* Червона рамка + фон */
.valid   /* Зелена рамка + фон */
```

### Типи сповіщень
```css
.success  /* Зелений */
.error    /* Червоний */
.warning  /* Помаранчевий */
.info     /* Синій */
```

## Приклади інтеграції

### Валідація форми логіну
```javascript
function validateEmail(emailInput) {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
        notificationManager.showFormValidation(emailInput, false, 'Email обов\'язковий');
        return false;
    }
    if (!emailRegex.test(value)) {
        notificationManager.showFormValidation(emailInput, false, 'Некоректний email');
        return false;
    }
    
    notificationManager.showFormValidation(emailInput, true);
    return true;
}
```

### Обробка кошика
```javascript
function addToCart(productId) {
    if (productId) {
        // Додати товар в localStorage
        addProductToCart(productId);
        
        // Показати сповіщення
        const productName = getProductName(productId);
        notificationManager.showCartNotification('product-added', productName);
    } else {
        notificationManager.showCartNotification('product-not-found');
    }
}
```

### Пошук товарів
```javascript
function searchProducts(query) {
    if (!query.trim()) {
        notificationManager.showToast('warning', 'Введіть назву для пошуку');
        return;
    }
    
    const results = findProducts(query);
    if (results.length === 0) {
        notificationManager.showCartNotification('product-not-found');
    } else {
        notificationManager.showToast('success', `Знайдено ${results.length} товарів`);
    }
}
```

## Методи API

### NotificationManager

#### showPopup(type, title, message, duration)
- `type`: 'success' | 'error' | 'warning' | 'info'
- `title`: заголовок сповіщення
- `message`: детальний опис
- `duration`: час показу в мс (0 = без автозакриття)

#### showToast(type, message, duration)
- `type`: 'success' | 'error' | 'warning' | 'info'  
- `message`: короткий текст
- `duration`: час показу в мс (за замовчуванням 3000)

#### showFormValidation(element, isValid, message)
- `element`: DOM елемент поля форми
- `isValid`: true/false стан валідації
- `message`: текст помилки (якщо isValid = false)

#### showCartNotification(type, customMessage)
- `type`: 'product-added' | 'cart-cleared' | 'checkout-success' | 'product-not-found'
- `customMessage`: власний текст (опціонально)

#### clearAll()
Видаляє всі активні сповіщення

## Тестування

Відкрийте `test-notifications.html` для інтерактивного тестування всіх функцій системи сповіщень.

## Налаштування

Кольори та стилі можна налаштувати в файлі `_forms.scss`:

```scss
// Кольори сповіщень
$success-color: #27ae60;
$error-color: #e74c3c; 
$warning-color: #f39c12;
$info-color: #3498db;

// Позиції та анімації
$notification-duration: $animation-medium;
$notification-z-index: $z-notification;
```