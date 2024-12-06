<template>
  <div class="input-content">
    <el-input
        :placeholder="placeholder"
        v-model="amountValue"
        @input="handleAmountChange"
        @blur = "handleAmountChange2"
        :disabled="disabled"
        :style="styleValue"
    ></el-input>
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入金额'
    },
    styleValue: {
      type: String,
      default: 'width: 150px'
    }
  },
  data() {
    return {
      amountValue: this.amount
    }
  },
  watch: {
    // 默认显示金额
    amount(val) {
      this.handleAmountChange(val)
    }
  },
  methods: {
    handleAmountChange(val) {
      // 去除前后空格
      let value = val.trim()
      // 去除，分隔符
      if (value.indexOf(',') !== -1) {
        value = value.split(',').join('')
        // 防止输入非数字,第一位可为负号
      } else if (isNaN(value) && value !== '-') {
        value = ''
      }

      this.amountValue = value
      this.$emit('handleAmountChange', value)
    },

    handleAmountChange2(val) {
      // 去除前后空格
      let value = parseFloat(value).toFixed(2);
      this.amountValue = value
      this.$emit('handleAmountChange', value)
    }
  }
}
</script>
<style lang='less' scoped>
.input-content {
  display: inline-block;
}
</style>