Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    id: {
      type: String
    },
    test: {
      type: String
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    handleError: function (e) {
      console.log(e)
    }
    // 这里是一个自定义方法
  }
})