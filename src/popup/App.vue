<template>
  <div class="container">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-toolbar md-elevation="0">
          <div class="md-layout md-alignment-center-left">
            <h3 class="md-title">Jira BurnChart</h3>
          </div>
        </md-toolbar>
      </div>
    </div>
    <div class="md-layout md-alignment-center-left select-options">
      <H1>Works !!</H1>
    </div>
  </div>
</template>
<script>

export default {
  name: 'PopupContainer',
  data () {
    return {
      sprints: [],
      issues: []
    };
  },
  methods: {
  }
};
</script>

<style>
  .container {
    position: relative;
    background: #fff;
    width: 100%;
    height: auto;
  }
  .select-options .md-field,
  .select-options .md-switch {
    width: 200px;
    margin: 0 100px 0 20px;
    display:inline;
  }
  .select-options .md-switch {
    padding-top: 16px;
    display: flex;
  }
  .md-layout-item { position: relative; }

  .inner-container { padding: 20px; }

  .md-table-row:hover:not(.md-header-row) .md-table-cell { background: unset !important; }

  .no-wrap { white-space: nowrap; }

  .error-message {
    text-align: center;
    font-size: 16px;
    position: absolute;
    bottom: 0;
  }

  .resolved { text-decoration: line-through; }

  .md-field.md-focused .md-input,
  .md-field.md-focused .md-textarea,
  .md-field.md-has-value .md-input,
  .md-field.md-has-value .md-textarea { font-size: 14px; }
  .custom-checkbox { margin-top: 4px; }

  img { width: 32px; }
</style>
