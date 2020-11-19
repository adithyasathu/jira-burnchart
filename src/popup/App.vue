<template>
  <div class="container">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-toolbar md-elevation="0">
          <div class="md-layout md-alignment-center-left">
            <img src="/icons/burn_32.png" alt="Avatar">
            <h3 class="md-title">Jira BurnChart</h3>
          </div>
          <div class="md-toolbar-section-end">
            <a href="../options/options.html" target="_blank">
              <md-button class="md-icon-button">
                <md-icon>settings</md-icon>
              </md-button>
            </a>
          </div>
        </md-toolbar>
      </div>
    </div>
    <div class="md-layout md-alignment-center-left select-options">
      <md-field>
        <label for="sprints">Sprints</label>
        <md-select v-model="sprintSelected" name="sprints" id="sprints">
          <md-option value="both">Both</md-option>
          <md-option v-for="sprint in sprints"
                     :key="sprint.id" :value="sprint.id">{{sprint.name}}</md-option>
        </md-select>
      </md-field>
      <md-switch v-model="showChart">Chart</md-switch>
    </div>
    <line-chart v-if="showChart"  :chartdata="chartData" :options="options"/>
    <div v-else class="inner-container">
      <div class="md-layout">
        <div class="md-layout-item">

          <!--<md-table v-model="issues">
            <md-table-row slot="md-table-row" slot-scope="{ issue }">
              <md-table-cell md-label="Issue" v-bind:class="{ 'resolved': issue.done }">{{ issue.key }}</md-table-cell>
              <md-table-cell md-label="Description">{{ issue.summary }}</md-table-cell>
              <md-table-cell md-label="Estimate">{{ issue.estimateStatistic.statFieldValue.value }}</md-table-cell>
              <template v-for="date in dates">
                <md-table-cell md-label="{{date}}">{{issue[date]}}</md-table-cell>
              </template>
            </md-table-row>
          </md-table>-->

         <md-table>
            <md-table-row>
              <md-table-head>
                <md-checkbox v-model="checkAllIssues" class="custom-checkbox" @change="doCheckAllIssues" />
              </md-table-head>
              <md-table-head>Issue</md-table-head>
              <md-table-head>Description</md-table-head>
              <md-table-head>Estimate</md-table-head>
              <template v-for="date in dates">
                <md-table-head>{{date}}</md-table-head>
              </template>
            </md-table-row>

            <md-table-row v-for="issue in issues" :key="issue.id">
              <md-table-cell class="no-wrap">
                <md-checkbox v-model="selectedIssues" :value="issue.key" />
              </md-table-cell>
              <md-table-cell class="no-wrap" v-bind:class="{ 'resolved': issue.done }">{{ issue.key }}</md-table-cell>
              <md-table-cell>{{issue.summary}}</md-table-cell>
              <md-table-cell class="no-wrap">{{ issue.estimateStatistic.statFieldValue.value }}</md-table-cell>
              <template v-for="date in dates">
                <md-table-cell>{{issue[date]}}</md-table-cell>
              </template>
            </md-table-row>
          </md-table>
        </div>
      </div>
    </div>
    <md-toolbar v-if="errorMessage"
                class="md-accent error-message md-layout md-alignment-center-center">
      <p>{{ errorMessage }}</p>
    </md-toolbar>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import LineChart from './Chart.vue'


export default {
  name: 'PopupContainer',
  components: { LineChart },
  data () {
    return {
      sprintSelected: null,
      chartSelected: null,
      sprints: [],
      issues: [],
      selectedIssues: [],
      comments: [],
      dates: [],
      checkAllIssues: false,
      showChart: false,
      errorMessage: null,
      jiraUrl: '',
      jiraGetAllData: '/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=',
      jiraComments: '/rest/api/2/issue/',
      rapidViewId: '',
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Burn down',
            backgroundColor: '#f87979',
            data: [29, 29, 28.5, 26, 26, 13, 6, 0]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  watch: {
    sprintSelected: {
      handler (val) {
        const _self = this;
        if ('both' === val) {
          _self.syncFromJira(null);
        } else {
          _self.syncFromJira(val);
        }
      }
    },
    chartSelected: {
      immediate: true,
      handler (val) {
        const _self = this;
        _self.showChart = false;
        if (val) {
          _self.showChart = true;
        }
      }
    }
  },
  created () {
    const _self = this;
    chrome.storage.sync.get({
      jiraUrl: '',
      rapidViewId: '',
    }, function (setting) {
      _self.jiraUrl = setting.jiraUrl;
      _self.rapidViewId = setting.rapidViewId;
      _self.syncFromJira(null);
    });
  },
  methods: {
    syncFromJira (sprintId) {
      const _self = this;
      _self.render = false;
      if (!_self.jiraUrl) {
        _self.errorMessage = 'Please configure the JIRA url through settings';
      } else if (!_self.rapidViewId) {
        _self.errorMessage = 'Please configure the JIRA board number(RapidViewId) through settings';
      }
      if (_self.jiraUrl && _self.rapidViewId) {
        let url = _self.jiraUrl + _self.jiraGetAllData + _self.rapidViewId;
        url = sprintId ? `${url}&activeSprints=${sprintId}`: url;
        axios.get(url)
                .then(async (response) => {
                  console.log(" Response >> ", response);
                  if (response && response.data) {
                    // sprints
                    if (response.data.sprintsData && response.data.sprintsData.sprints
                            && response.data.sprintsData.sprints[0]) {
                      _self.sprints = response.data.sprintsData.sprints;
                      const sprint = response.data.sprintsData.sprints[0];
                      _self.dates = _self.enumerateDaysBetweenDates(sprint.startDate, sprint.endDate);
                    }

                    // issues
                    if (response.data.issuesData && response.data.issuesData.issues) {
                      const issues = response.data.issuesData.issues.
                      filter(issue => issue && !issue.hasOwnProperty('parentId'));
                      // initialise all days burn down as zero
                      _self.issues = issues.map(issue => {
                        _self.dates.map((date) => {
                          issue[date] = 0
                        })
                      });
                      console.log("Issues ", issues);
                      _self.issues = issues;
                    }

                    _self.fetchBurnDown();
                  }
                })
                .catch(function (error) {
                  _self.errorMessage = error;
                });
      }
    },
    fetchBurnDown () {
      const _self = this;
      for (let issue of _self.issues) {
        if (issue && issue.estimateStatistic &&
                issue.estimateStatistic.statFieldValue &&
                  issue.estimateStatistic.statFieldValue.value) { // do it only for PBI's with estimate
           axios.get(_self.jiraUrl + _self.jiraComments + issue.key + '/comment')
                  .then((response) => {
                    if (response && response.data && response.data.comments) {
                      for (let comment of response.data.comments) {
                          const matchCurrent = comment.body.match(/current \d*(\.\d+)?/i);
                          if (matchCurrent && matchCurrent[0]) {
                            issue['current'] = Number(matchCurrent[0].substring(8));
                          }

                          const match = comment.body.match(/burndown \d*(\.\d+)?/i);
                          if (match && match[0]) {
                            issue[moment(comment.created).format('MM/DD')] = Number(match[0].substring(9));
                          }

                          const matches = comment.body.match(/burndown\(\d{4}\/\d{2}\/\d{2}\) \d*(\.\d+)?/mig);
                          if (matches) {
                            for (let match of matches) {
                              if (match.length > 20) {
                                issue[moment(match.substring(9,19), 'YYYY-MM-DD').format('MM/DD')] = Number(match.substring(20));
                              }
                            }
                          }
                      }
                    }
                  })
                  .catch(function (error) {
                    console.err("Error occurred during fetching burn down", error);
                    _self.errorMessage = error;
                  });
        }
     }
      // compute chart data
      _self.chartData.labels = _self.dates;
    },
    enumerateDaysBetweenDates(startDate, endDate) {
      const dates = [];
      const currDate = moment(startDate, 'DD/MMM/YY h:mm a').startOf('day');
      const lastDate = moment(endDate, 'DD/MMM/YY h:mm a').startOf('day');
      while(currDate.add(1, 'days').diff(lastDate) < 0) {
        if (currDate.isoWeekday() < 6) {
            dates.push(currDate.clone().format('MM/DD'));
        }
      }
      return dates;
    },
    doCheckAllIssues () {
      let _self = this;
      if (_self.checkAllIssues && _self.issues && _self.issues.length > 0) {
        _self.selectedIssues = _self.issues.map(issue => issue.key);
      } else {
        _self.selectedIssues = [];
      }
    },
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
