// =============================================================================
// Notification System
// =============================================================================

class NotificationManager {
    constructor() {
        this.notificationContainer = null;
        this.activeNotifications = new Set();
        this.init();
    }

    init() {
        // Створюємо контейнер для сповіщень якщо його немає
        if (!document.getElementById('notification-container')) {
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.id = 'notification-container';
            document.body.appendChild(this.notificationContainer);
        }
    }

    // Popup сповіщення (детальні з заголовком та описом)
    showPopup(type = 'info', title, message, duration = 5000) {
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',  
            warning: '⚠️',
            info: 'ℹ️'
        };

        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">${icons[type] || icons.info}</div>
                <div class="popup-text">
                    <div class="popup-title">${title}</div>
                    <div class="popup-message">${message}</div>
                </div>
            </div>
            <button class="popup-close">&times;</button>
        `;

        // Додаємо обробники подій
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => this.hidePopup(popup));

        // Додаємо в DOM та показуємо
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 10);

        // Автоматично приховуємо після duration
        if (duration > 0) {
            setTimeout(() => this.hidePopup(popup), duration);
        }

        this.activeNotifications.add(popup);
        return popup;
    }

    hidePopup(popup) {
        if (popup && this.activeNotifications.has(popup)) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
                this.activeNotifications.delete(popup);
            }, 300);
        }
    }

    // Toast сповіщення (короткі)
    showToast(type = 'info', message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);

        return toast;
    }

    // Inline сповіщення для форм
    showInlineNotification(element, type = 'error', message) {
        // Видаляємо існуюче сповіщення
        this.hideInlineNotification(element);

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.dataset.field = element.name || element.id;

        // Знаходимо батьківський контейнер
        const parent = element.closest('.form-group') || element.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            parent.appendChild(notification);
        }

        return notification;
    }

    hideInlineNotification(element) {
        const parent = element.closest('.form-group') || element.parentElement;
        if (parent) {
            const existing = parent.querySelector('.notification');
            if (existing) {
                existing.remove();
            }
        }
    }

    // Special methods for specific cases
    
    // For cart
    showCartNotification(type, message) {
        const titles = {
            'product-added': 'Product Added!',
            'cart-cleared': 'Cart Cleared',
            'checkout-success': 'Thank You for Your Purchase!',
            'product-not-found': 'Error'
        };

        const messages = {
            'product-added': message || 'Product successfully added to cart',
            'cart-cleared': 'Your cart is empty. Use the catalog to add new items.',
            'checkout-success': 'Thank you for your purchase. A manager will contact you shortly.',
            'product-not-found': 'Product not found. Please check the link.'
        };

        const notificationType = ['product-added'].includes(type) ? 'success' : 
                               ['product-not-found'].includes(type) ? 'error' : 'info';

        return this.showPopup(
            notificationType,
            titles[type] || 'Notification',
            messages[type] || message,
            type === 'checkout-success' ? 7000 : 4000
        );
    }

    // Для форм
    showFormValidation(fieldElement, isValid, message = '') {
        if (isValid) {
            this.hideInlineNotification(fieldElement);
            fieldElement.classList.remove('error');
            fieldElement.classList.add('valid');
        } else {
            this.showInlineNotification(fieldElement, 'error', message);
            fieldElement.classList.remove('valid');
            fieldElement.classList.add('error');
        }
    }

    // Очистити всі сповіщення
    clearAll() {
        this.activeNotifications.forEach(notification => {
            this.hidePopup(notification);
        });
        
        document.querySelectorAll('.toast-notification').forEach(toast => {
            toast.remove();
        });
        
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });
    }
}

// Створюємо глобальний екземпляр
window.notificationManager = new NotificationManager();

// Експортуємо для використання в модулях
export default window.notificationManager;