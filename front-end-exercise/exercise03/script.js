// 等待HTML文档完全加载后再执行脚本
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 获取DOM元素 ---
    const userList = document.getElementById('user-list');
    const addUserForm = document.getElementById('add-user-form');
    const nameInput = document.getElementById('name-input');

    // --- 2. 数据状态管理 ---
    // 使用一个数组来存储所有用户数据。初始加载一些示例数据。
    let users = [
        { id: 1, name: 'Harry Potter' },
        { id: 2, name: 'Edward' },
        { id: 3, name: 'Noname' }
    ];

    // --- 3. 核心功能函数 ---

    /**
     * 渲染用户列表
     * 这个函数会根据当前的 `users` 数组，重新绘制整个列表。
     */
    function renderUsers() {
        // 先清空现有列表，防止重复添加
        userList.innerHTML = '';

        // 如果没有用户，显示提示信息
        if (users.length === 0) {
            userList.innerHTML = '<li>No users yet.</li>';
            return;
        }

        // 遍历users数组，为每个用户创建一个列表项
        users.forEach((user, index) => {
            const li = document.createElement('li');
            
            // 为每个列表项添加 data-id 属性，方便后续操作时识别是哪个用户
            li.dataset.id = user.id;

            li.innerHTML = `
                <span>${index + 1} :</span>
                <span class="user-name">${user.name}</span>
                <button class="btn edit-btn">✏️</button>
                <button class="btn delete-btn">❌</button>
            `;
            userList.appendChild(li);
        });
    }

    /**
     * 添加新用户
     * @param {string} name - 新用户的名字
     */
    function addUser(name) {
        if (!name) return; // 如果名字为空，则不添加

        const newUser = {
            // 使用时间戳作为独一无二的id
            id: Date.now(), 
            name: name
        };
        users.push(newUser);
        renderUsers(); // 重新渲染列表
    }

    /**
     * 编辑用户
     * @param {number} id - 要编辑的用户的ID
     */
    function editUser(id) {
        const userToEdit = users.find(user => user.id === id);
        if (!userToEdit) return;

        // 弹出一个输入框让用户输入新名字，默认值为旧名字
        const newName = prompt('Enter new name:', userToEdit.name);

        // 如果用户输入了新名字 (没有点取消或留空)
        if (newName !== null && newName.trim() !== '') {
            userToEdit.name = newName.trim();
            renderUsers(); // 重新渲染列表
        }
    }

    /**
     * 删除用户
     * @param {number} id - 要删除的用户的ID
     */
    function deleteUser(id) {
        // 使用 filter 方法创建一个不包含要删除用户的新数组
        users = users.filter(user => user.id !== id);
        renderUsers(); // 重新渲染列表
    }

    // --- 4. 事件监听器 ---

    // 监听表单的提交事件
    addUserForm.addEventListener('submit', (event) => {
        // 阻止表单提交导致的页面刷新
        event.preventDefault();
        
        const newName = nameInput.value.trim();
        addUser(newName);
        
        // 清空输入框并重新聚焦
        nameInput.value = '';
        nameInput.focus();
    });

    // 监听整个列表的点击事件 (事件委托)
    // 这样比给每个按钮单独添加监听器更高效
    userList.addEventListener('click', (event) => {
        const target = event.target;
        const li = target.closest('li'); // 找到被点击按钮所在的 li 元素
        if (!li) return;

        const userId = Number(li.dataset.id);

        // 判断点击的是编辑按钮还是删除按钮
        if (target.classList.contains('edit-btn')) {
            editUser(userId);
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(userId);
            }
        }
    });

    // --- 5. 初始渲染 ---
    // 页面加载后，立即调用一次 renderUsers 来显示初始数据
    renderUsers();
});