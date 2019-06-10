new Vue({
    el: "#app",
    data: {
        productList: [],
        selectAllFlag: false,
    },
    filters: {
        /**
         * 格式化金额
         * @param value 原始金额
         * @returns {string} ¥作为前缀，并且保留2位小数
         */
        money: function (value) {
            return "¥ " + value.toFixed(2);
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.cartView();
        })
    },
    computed: {
        /**
         * 所有选中商品的总价
         */
        totalPrice: function () {
            let result = 0;
            this.productList.forEach((product, index) => {
                if (product.checked == true) {
                    result += (product.productPrice *  product.productQuantity);
                }
            });
            return result;
        }
    },
    methods: {
        /**
         * 请求后端获取购物车数据
         */
        cartView: function () {
            this.$http.get("data/cartData.json").then(res => {
                this.productList = res.data.result.list;
            });
        },
        /**
         * 增减商品数量
         *
         * @param product 商品
         * @param quantity 增减的数量
         */
        changeQuantity: function (product, quantity) {
            if (quantity < 0 && product.productQuantity <= 1) {
                return;
            }

            product.productQuantity += quantity;
        },
        /**
         * 选择或者取消选择商品
         *
         * @param product 商品
         */
        selectProduct: function (product) {
            if (typeof product.checked == 'undefined') {
                // 如果 checked 属性未定义
                // Vue.set(product, 'checked', true);
                // 也可以使用 vm.$set()
                this.$set(product, 'checked', true);
            } else {
                // checked 属性已定义好了
                product.checked = !product.checked;
            }
        },
        /**
         * 全选
         */
        selectAll: function () {
            this.selectAllFlag = !this.selectAllFlag;

            this.productList.forEach((product, index) => {
                if (typeof product.checked == 'undefined') {
                    this.$set(product, 'checked', this.selectAllFlag);
                } else {
                    product.checked = this.selectAllFlag;
                }
            });
        },
        /**
         * 删除商品
         */
        deleteProduct: function (product) {
            let index = this.productList.indexOf(product);
            this.productList.splice(index, 1);
        }
    }
});