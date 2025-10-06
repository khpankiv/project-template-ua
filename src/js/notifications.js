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
        // Create notifications container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.id = 'notification-container';
            document.body.appendChild(this.notificationContainer);
        }
    }

    // Popup notifications (detailed with title and description)
    showPopup(title, message, type = 'info', duration = 5000) {
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',  
            warning: '⚠️',
            info: 'ℹ️'
        };

        // Safe DOM element creation instead of innerHTML
        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        
        const popupIcon = document.createElement('div');
        popupIcon.className = 'popup-icon';
        popupIcon.textContent = icons[type] || icons.info;
        
        const popupText = document.createElement('div');
        popupText.className = 'popup-text';
        
        const popupTitle = document.createElement('div');
        popupTitle.className = 'popup-title';
        popupTitle.textContent = title || 'Notification';
        
        const popupMessage = document.createElement('div');
        popupMessage.className = 'popup-message';
        popupMessage.textContent = message || '';
        
        popupText.appendChild(popupTitle);
        popupText.appendChild(popupMessage);
        
        popupContent.appendChild(popupIcon);
        popupContent.appendChild(popupText);
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'popup-close';
        closeBtn.textContent = '×';
        
        popup.appendChild(popupContent);
        popup.appendChild(closeBtn);

        // Add event handlers
        closeBtn.addEventListener('click', () => this.hidePopup(popup));

        // Add to DOM and show
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 10);

        // Auto-hide after duration
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

    // Toast notifications (short)
    showToast(message, type = 'info', duration = 3000) {
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

    // Inline notifications for forms
    showInlineNotification(element, message, type = 'error') {
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

        let notificationType = 'info';
        if (['product-added'].includes(type)) {
            notificationType = 'success';
        } else if (['product-not-found'].includes(type)) {
            notificationType = 'error';
        }

        return this.showPopup(
            titles[type] || 'Notification',
            messages[type] || message,
            notificationType,
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
            this.showInlineNotification(fieldElement, message, 'error');
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