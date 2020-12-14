<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
import { TaskReport } from "@/api/mars"
import { string } from 'jszip/lib/support'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      jsonEditor: false,
      id: undefined,
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true
    })
    this.getValue()
    this.getData(this.id)
    // this.jsonEditor.setValue(JSON.stringify({ "task_id": "f1c07f5e8329a98184902521c9ed656d", "pid": 1, "duration": "124.610001", "targets": "172.31.50.157,zan71.com,172.31.50.254", "hosts": [{ "target": "172.31.50.157", "addr_type": "ipv4", "services": [{ "port": 3389, "protocol": "tcp", "name": "ms-wbt-server", "state": "open", "reason": "syn-ack", "reason_ttl": 128 }] }, { "target": "47.92.255.39", "addr_type": "ipv4", "services": [{ "port": 22, "protocol": "tcp", "name": "ssh", "state": "open", "reason": "syn-ack", "reason_ttl": 51 }, { "port": 80, "protocol": "tcp", "name": "http", "state": "open", "reason": "syn-ack", "reason_ttl": 51 }, { "port": 443, "protocol": "tcp", "name": "https", "state": "open", "reason": "syn-ack", "reason_ttl": 51 }, { "port": 3389, "protocol": "tcp", "name": "ms-wbt-server", "state": "closed", "reason": "reset", "reason_ttl": 51 }] }, { "target": "172.31.50.254", "addr_type": "ipv4", "services": [{ "port": 22, "protocol": "tcp", "name": "ssh", "state": "open", "reason": "syn-ack", "reason_ttl": 64 }, { "port": 111, "protocol": "tcp", "name": "rpcbind", "state": "open", "reason": "syn-ack", "reason_ttl": 64 }, { "port": 3306, "protocol": "tcp", "name": "mysql", "state": "filtered", "reason": "no-response", "reason_ttl": 0 }, { "port": 5901, "protocol": "tcp", "name": "vnc-1", "state": "open", "reason": "syn-ack", "reason_ttl": 64 }, { "port": 6001, "protocol": "tcp", "name": "X11:1", "state": "open", "reason": "syn-ack", "reason_ttl": 64 }, { "port": 9200, "protocol": "tcp", "name": "wap-wsp", "state": "filtered", "reason": "no-response", "reason_ttl": 0 }] }], "err_msg": "" }, null, 2))
    // this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    // this.jsonEditor.on('change', cm => {
    //   this.$emit('changed', cm.getValue())
    //   this.$emit('input', cm.getValue())
    // })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
    getData(id) {
      let query = { "pid": Number(id) }
      TaskReport(query).then((response) => {
        console.log(response.data)
        this.jsonEditor.setValue(JSON.stringify(response.data, null, 2))
        // setTimeout(() => { this.listLoading = false; }, 1.5 * 1000);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #f08047;
    }
  }
}
</style>