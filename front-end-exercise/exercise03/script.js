// 等待HTML文档完全加载后再执行脚本
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 获取DOM元素 ---
    const userList = document.getElementById('user-list');
    const addUserForm = document.getElementById('add-user-form');
    const nameInput = document.getElementById('name-input');
    const searchInput = document.getElementById('search-input'); // 新增：获取搜索框

    // --- 2. 数据状态管理 ---
    // 这是我们的“数据源”，所有操作都围绕这个主数组进行。
    let users = [
        { id: 1, name: 'Harry Potter' },
        { id: 2, name: 'Edward Cullen' },
        { id: 3, name: 'Noname' },
        { id: 4, name: 'Hermione Granger' },
        { id: 5, name: 'Peter Parker' }
    ];

    // --- 3. 核心功能函数 ---

    /**
     * 渲染用户列表
     * @param {Array} usersToRender - 需要被渲染到页面上的用户数组
     */
    function renderUsers(usersToRender) {
        userList.innerHTML = '';

        if (usersToRender.length === 0) {
            userList.innerHTML = '<li>No users found.</li>';
            return;
        }

        usersToRender.forEach((user, index) => {
            const li = document.createElement('li');
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
     * 新增：更新视图函数
     * 根据搜索框的输入值，从主 `users` 数组中筛选并渲染列表
     */
    function updateView() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    }


    /**
     * 添加新用户
     * @param {string} name - 新用户的名字
     */
    function addUser(name) {
        if (!name) return;
        const newUser = {
            id: Date.now(),
            name: name
        };
        users.push(newUser);
        updateView(); // 修改：调用updateView以保持搜索状态
    }

    /**
     * 编辑用户
     * @param {number} id - 要编辑的用户的ID
     * 注：在真实的REST API中，这个操作通常对应一个HTTP PUT或PATCH请求。
     * 例如: fetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify({ name: newName }) })
     */
    function editUser(id) {
        const userToEdit = users.find(user => user.id === id);
        if (!userToEdit) return;

        const newName = prompt('Enter new name:', userToEdit.name);

        if (newName !== null && newName.trim() !== '') {
            userToEdit.name = newName.trim();
            updateView(); // 修改：调用updateView
        }
    }

    /**
     * 删除用户
     * @param {number} id - 要删除的用户的ID
     * 注：在真实的REST API中，这个操作对应一个HTTP DELETE请求。
     * 例如: fetch(`/api/users/${id}`, { method: 'DELETE' })
     */
    function deleteUser(id) {
        users = users.filter(user => user.id !== id);
        updateView(); // 修改：调用updateView
    }

    // --- 4. 事件监听器 ---

    // 监听表单的提交事件
    addUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newName = nameInput.value.trim();
        addUser(newName);
        nameInput.value = '';
        nameInput.focus();
    });
    
    // 新增：监听搜索框的输入事件，实现实时搜索
    searchInput.addEventListener('input', updateView);

    // 监听整个列表的点击事件 (事件委托)
    userList.addEventListener('click', (event) => {
        const target = event.target;
        const li = target.closest('li');
        if (!li) return;

        const userId = Number(li.dataset.id);

        if (target.classList.contains('edit-btn')) {
            editUser(userId);
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(userId);
            }
        }
    });

    // --- 5. 初始渲染 ---
    // 页面加载后，调用一次 updateView 来显示初始数据
    updateView();
});