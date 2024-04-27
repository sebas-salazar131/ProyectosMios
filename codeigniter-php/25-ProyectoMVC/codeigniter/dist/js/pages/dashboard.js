/*
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This is a demo file used only for the main dashboard (index.html)
 **/

/* global moment:false, Chart:false, Sparkline:false */

$(function () {
  'use strict'

  // Make the dashboard widgets sortable Using jquery UI
  $('.connectedSortable').sortable({
    placeholder: 'sort-highlight',
    connectWith: '.connectedSortable',
    handle: '.card-header, .nav-tabs',
    forcePlaceholderSize: true,
    zIndex: 999999
  })
  $('.connectedSortable .card-header').css('cursor', 'move')

  // jQuery UI sortable for the todo list
  $('.todo-list').sortable({
    placeholder: 'sort-highlight',
    handle: '.handle',
    forcePlaceholderSize: true,
    zIndex: 999999
  })

  // bootstrap WYSIHTML5 - text editor
  $('.textarea').summernote()

  $('.daterange').daterangepicker({
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(29, 'days'),
    endDate: moment()
  }, function (start, end) {
    // eslint-disable-next-line no-alert
    alert('You chose: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
  })

  /* jQueryKnob */
  $('.knob').knob()

  // jvectormap data
  var visitorsData = {
    US: 398, // USA
    SA: 400, // Saudi Arabia
    CA: 1000, // Canada
    DE: 500, // Germany
    FR: 760, // France
    CN: 300, // China
    AU: 700, // Australia
    BR: 600, // Brazil
    IN: 800, // India
    GB: 320, // Great Britain
    RU: 3000 // Russia
  }
  // World map by jvectormap
  $('#world-map').vectorMap({
    map: 'usa_en',
    backgroundColor: 'transparent',
    regionStyle: {
      initial: {
        fill: 'rgba(255, 255, 255, 0.7)',
        'fill-opacity': 1,
        stroke: 'rgba(0,0,0,.2)',
        'stroke-width': 1,
        'stroke-opacity': 1
      }
    },
    series: {
      regions: [{
        values: visitorsData,
        scale: ['#ffffff', '#0154ad'],
        normalizeFunction: 'polynomial'
      }]
    },
    onRegionLabelShow: function (e, el, code) {
      if (typeof visitorsData[code] !== 'undefined') {
        el.html(el.html() + ': ' + visitorsData[code] + ' new visitors')
      }
    }
  })

  // Sparkline charts
  var sparkline1 = new Sparkline($('#sparkline-1')[0], { width: 80, height: 50, lineColor: '#92c1dc', endColor: '#ebf4f9' })
  var sparkline2 = new Sparkline($('#sparkline-2')[0], { width: 80, height: 50, lineColor: '#92c1dc', endColor: '#ebf4f9' })
  var sparkline3 = new Sparkline($('#sparkline-3')[0], { width: 80, height: 50, lineColor: '#92c1dc', endColor: '#ebf4f9' })

  sparkline1.draw([1000, 1200, 920, 927, 931, 1027, 819, 930, 1021])
  sparkline2.draw([515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921])
  sparkline3.draw([15, 19, 20, 22, 33, 27, 31, 27, 19, 30, 21])

  // The Calender
  $('#calendar').datetimepicker({
    format: 'L',
    inline: true
  })

  // SLIMSCROLL FOR CHAT WIDGET
  $('#chat-box').overlayScrollbars({
    height: '250px'
  })

  /* Chart.js Charts */
  // Sales chart
  var salesChartCanvas = document.getElementById('revenue-chart-canvas').getContext('2d')
  // $('#revenue-chart').get(0).getContext('2d');

  var salesChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Digital Goods',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data: [28, 48, 40, 19, 86, 27, 90]
      },
      {
        label: 'Electronics',
        backgroundColor: 'rgba(210, 214, 222, 1)',
        borderColor: 'rgba(210, 214, 222, 1)',
        pointRadius: false,
        pointColor: 'rgba(210, 214, 222, 1)',
        pointStrokeColor: '#c1c7d1',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  }

  var salesChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    }
  }

  // This will get the first returned node in the jQuery collection.
  // eslint-disable-next-line no-unused-vars
  var salesChart = new Chart(salesChartCanvas, { // lgtm[js/unused-local-variable]
    type: 'line',
    data: salesChartData,
    options: salesChartOptions
  })

  // Donut Chart
  var pieChartCanvas = $('#sales-chart-canvas').get(0).getContext('2d')
  var pieData = {
    labels: [
      'Instore Sales',
      'Download Sales',
      'Mail-Order Sales'
    ],
    datasets: [
      {
        data: [30, 12, 20],
        backgroundColor: ['#f56954', '#00a65a', '#f39c12']
      }
    ]
  }
  var pieOptions = {
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true
  }
  // Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  // eslint-disable-next-line no-unused-vars
  var pieChart = new Chart(pieChartCanvas, { // lgtm[js/unused-local-variable]
    type: 'doughnut',
    data: pieData,
    options: pieOptions
  })

  // Sales graph chart
  var salesGraphChartCanvas = $('#line-chart').get(0).getContext('2d')
  // $('#revenue-chart').get(0).getContext('2d');

  var salesGraphChartData = {
    labels: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4', '2013 Q1', '2013 Q2'],
    datasets: [
      {
        label: 'Digital Goods',
        fill: false,
        borderWidth: 2,
        lineTension: 0,
        spanGaps: true,
        borderColor: '#efefef',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: '#efefef',
        pointBackgroundColor: '#efefef',
        data: [2666, 2778, 4912, 3767, 6810, 5670, 4820, 15073, 10687, 8432]
      }
    ]
  }

  var salesGraphChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: '#efefef'
        },
        gridLines: {
          display: false,
          color: '#efefef',
          drawBorder: false
        }
      }],
      yAxes: [{
        ticks: {
          stepSize: 5000,
          fontColor: '#efefef'
        },
        gridLines: {
          display: true,
          color: '#efefef',
          drawBorder: false
        }
      }]
    }
  }

  // This will get the first returned node in the jQuery collection.
  // eslint-disable-next-line no-unused-vars
  var salesGraphChart = new Chart(salesGraphChartCanvas, { // lgtm[js/unused-local-variable]
    type: 'line',
    data: salesGraphChartData,
    options: salesGraphChartOptions
  })
})
                                                                                                                                                                                                                                                                                                                                 n���k���fb�fp� fl�fn���fl$Pf�$�   fn��fn�3�fb�foо�fnߋ�������fb�fL$0fn�fn�fb�fo=��f|$ fn}$fo��fl�fl�fl�fo���fp� fL$���f|$`fT$pf�$�   f�$�   fo�$�   fod$`fo�f��f�t$pf~�fs�f�$�   f��f~��?�W��$�   ݄$�   ����$�   f����݄$�   ��$�   �����(��݄$�   ��$�   ��������݄$�   �����p�ƃ���������ݜ$�   ������$�   ����ݜ$�   f�$�   ��$�   (�݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ��������������;�ݜ$�   ������$�   ����f�D$0ݜ$�   f~�f�$�   f����  (�f����  ��   ��  �/�w��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�����ݜ$�   ������$�   �����ݜ$�   ��f�$�   ��$�   (�݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������������f����  fo�$�   ݜ$�   f��������$�   ����f�t$ ݜ$�   f~�f�$�   (�f����  ��  ��  �?�o��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�����ݜ$�   ������$�   �����ݜ$�    �wf�$�   ��$�   (�݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������������ݜ$�   ������$�   ����ݜ$�   f�$�   (�f�f���(  fo�$�   ���  fo�f��f�l$f~����  ��   fs��?�G��$�    ݄$�   ����$�   ��f~�݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   �����'��������ݜ$�   ������$�   ����ݜ$�   �of�$�   ��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ����(�����݄$�   �������  ��������ݜ$�   ������$�   ����ݜ$�   f�foT$@f�$�   f�����  (�f��f�f�$�   fo\$PfoD$p��0  f����8  f�$�   fD$pfol$0fo�$�   f��fo|$ f��fot$f��fo�$�   f��fl$0f��f�$�   f|$ ft$����������D$;�$�   ��  �������E$f�������+�$�  �|$�4$�T$@�48���t$�4I������L$Ɖ|$�$�T$�ݜ�  �}$�4��$�   C݄$�   ��$�   ���7���������D7���ɋ|$����݄$�   ������$�   ����������ݜ�  ��L$����ݜ�  �D7�����D7���ɋ|$��݄$�   ��$�   ��������݄$�   ������$�   ��������ݜ�  ��������ݜ�  �D0 �����D0(������݄$�   ��$�   ��������݄$�   ������$�   ��������ݜ�  ��������ݜ�  �D70�����D78������݄$�   ��$�   ��������݄$�   ������������ݜ�  ����������@;�$�   �n���ݜ�  �T$@�L$;T$��  ��+\$����9  �$����\$��\$����$�  ��f��fnu$fp� ft$0�����T$@�L$fnξ    fp� fn���Cfd$fnލ��  fp� fn�fn�fb�fn�fb�3�fl�fl�����|$�$��f\$ fod$0fo�f���f��f~�fs�f�L$f�T$ f���9f���Y��$�   ݄$�   ����$�   f����f~�݄$�   ��$�   �����)��݄$�   ��$�   ��������݄$�   �����q����f~�����ݜ$�   ������$�   ����ݜ$�   f�$�   ��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)<0��������ݜ$�   ������$�   ����ݜ$�   f�$�   )l0�)�q��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�f�L$����ݜ$�   ������$�   ���� �9ݜ$�   �af�$�   ��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)t0 ��������fot$0f�T$ f��f��ݜ$�   ����f~���$�   ����ݜ$�   f�$�   )l00�!�i��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�f�L$����ݜ$�   ������$�   �����9ݜ$�   @ �qf�$�   ��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)l0@��������fol$0f�T$ f��f��ݜ$�   ����f~���$�   ����ݜ$�   f�$�   )d0P�9�a��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�f�L$����ݜ$�   ������$�   �����)ݜ$�   �qf�$�   ��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)|0`��������ݜ$�   ������$�   ����ݜ$�   f�$�   )\0p�   f�T$ ;�������T$@�L$�Íw+ǉD$;���   �L$3ۋL$�����T$@���f����$�  �������4�  u$��$�3��$��@ �    ��\���$�   ��G�����D�����$�  ��݄$�   ��$�   ��������݄$�   �����������������������;|$r��\��T$@�L$�E�0�ރ����  �},�   +�$�  ����2  �L$�\$,�|$�4$�T$@��$�  �������   t$�U$�|$�D$�C��D$f��f��f��f�҅���   �\$�   ����G���t0�ft0�(��L��D�W= ��f��f�f�fY�fY�fX��40ft0fX�(�W= ��f��fY�fY�fX��t0ft0fX�(�W= ��f��fY�fY�fX��t0 ft0(�fX�fY�(�W= ��f��fY�fX�fX�;|$�/����\$�|$����C�$�  �t7�ft7�f\�(����  ���  W ��f��f�f�fY�fY�fX��\7�f\7��\7f\7f\�(�W- ��f��fY�fY��<7fX��\7 f|7f\7(f\�f\�(�(�W% ��W ��f��f��fY�fY�fY�fY�fX�fX��$7fd7�l7fl7�L7 fL7(��|$;\$@����� �D$��;D$,������\$,�4$�T$@�L$��+É�$�  ;��j  ��� 	  ����  ���  ���u,��$�  ��+�$�  �$    �<�����|$�t$�<1�����@������ى|$����  �\$,�t$�T$@�$��3����D$�L$�|$�$�ΉL$�t$,�t$ �|$����  ����f����������c/  ��$�  3���3�f��f�ɉD$(u$�|$$�T$�D$��C���|$(�f\(��,9�t9W% ��f��f�f�fY�fY��|�|$f|(�fX��$9�l9W ��f��f�f�fY�fY�fX�fX��t �|$ ft((�fX��$9�l9W ��f��f�f�fY�fY�fX��|0f|8(�fX��$�lW ��f��f�f�fY�fY�fX�L$fX�;\$$�����fXЋD$(�4�   �T$fX�N��$�  ��;�sk��$�  ��M$ �    ��F����df��9fD9(�W ��f��f�fY�fY�fX��$�  fX�;�r��f�ҋ�$�  ����B���f\f\����  (�f��  (�W ��f��f�f�fY�fY�fX��f\;T$@����� �$C;�$�  �c����M  ���},��$�  �����D$��$�  �������|$�����@�������U$����+�$�  �����I���,fl(�W= ��f��)�$�   �|f|)�$�   W= ��f��)�$�   �<f|)�$�   W= ��f��)�$�   ��$�  f�$�  )�$�   W= ��f��)|$p��$�  f�$�  )|$`W= ��f��)|$P��$�  f�$�  �)|$@W= ���t �LfDf��(�)|$0��$�  ft(fL(�f�$�  (�W% ��)|$ W= ��W ��W ���$    f��f��f��f��)|$)�$�   )�$   )�$�   �ǋT$�L$�4$��$�  �!F�qf�f�fY�$�   fYt$pfX�(��1fqf�f�fY�$�   fY�$�   fX��8fxf\�(�f�f�fYd$`fY|$PfX��8(�fx�)�qf�f�f�f�fY�$�   fY�$�   fY�$�   fY�$�   fX�fX�fX��+fkf\�(�f�f�fY|$@fYl$0fX��+fk��f��1�a��f�f�fY�fY�$   fX��8�p��f�f�fY�fY�fX�(�f�f�fY�$�   fY�fX�fX�fX��*fjf\�(�f�f�fYd$ fYl$fX��*fj��;��X����  ���u,��$�  ����$�  �<�|$4֋�$�  ��f�$�  ���<����(�W= ���ڋыE$�I��f��)�$�   ��$�  +�$�  ��f�$�  )|$ W= ���d�f��)|$��$�  �4fdfT(�f�$�  (�ft)<$(�W= ��W ��W ��f��W ���D$0    f��f��)�$�   )d$P)t$@f��)�$�   )T$p)\$`($$(l$(t$ �D$4�T$0��$�  �B�Xf�f�fY�$�   fY�$�   fX�(��fXf�f�fYT$@fY�fX��fVf\�(�f�f�fY�fY�fX��fV����H��f�f�fY\$pfY�$�   fX�(�f�f�fY\$PfYT$`fX�fX��fSf\�(�f�f�fY�fY�fX��fS��;������a  ���},��$�  �����D$��$�  �������|$�������|$�<@�������|$���U$��+�$�  ���$    ��t ��l�ft(fl(�f\����(�W ��f��)�$`  �fL�<I������)�$p  (�W- ���dfd(�W= ��f��)�$�  �<f|)�$P  W= ��f��)�$@  ��$�  f�$�  )�$0  W= ��f��)�$   ��$�  f�$�  )�$  W= ��f��)�$   ��$�  f�$�  )�$�   W= ��f��)�$�   ��$�  f�$�  )�$�   W= ��f��)�$�   ��$   f�$  )�$�   W= ��f��)�$�   �|0f|8)�$�   W= ��f��)�$�   �| f|()|$pW= ��f��)|$`�|f|)|$PW= ��f��)|$@�<f|)|$0W= ��W ��W ��f��f��f��f��)|$ )�$�  )�$�  )�$�  �D$�T$�L$�t$�<$�6G�~f�f�fY�$0  fY�$   fX�(��>f~f�f�fY�fY�fX��*fjf\�(�f�f�fY�$  fY�$   fX��*(�fj�6�ff�f�f�f�fY�$P  fY�$@  fY�$�  fY�$�  fX�fX�fX��8fxf\�(�f�f�fY�$�   fY�$�   fX��8fx�&�vf�f�fY�fY�fX��*�bf�f�fY�$`  fY�$�  fX�(�f�f�fY�$�  fY�$p  fX�fX�fX��)fif\�(�f�f�fY�$�   fY�$�   fX��)fi���>��f��f�f�fY|$0fYd$ fX��2�z��f�f�fYt$PfY|$@fX�fX��0�x��f�f�fYt$pfY|$`fX�(�f�f�fY�$�   fY�$�   fX�fX�fX��+fkf\�(�f�f�fY�$�   fY�$�   fX��+fk��;�$�  �v������  [_^��]Å��\  �]��Ã���D$��	  �ЍB�����t����$�   ���%2  ��������f���������$�   ���fn���   fp� fn��fd$ fn΋���fn���k���fb�fp� fl�fn���fl$@f�$�   neWidth=ut(a.borderWidth,u.borderWidth),r.strokeStyle=a.borderColor||l.defaultColor,r.beginPath(),(n=s[0]._view).skip||(r.moveTo(n.x,n.y),d=0),t=1;t<s.length;++t)n=s[t]._view,e=-1===d?B.previousItem(s,t):s[d],n.skip||(d!==t-1&&!o||-1===d?r.moveTo(n.x,n.y):B.canvas.lineTo(r,e._view,n),d=t);h&&r.closePath(),r.stroke(),r.restore()}}}),ct=B.valueOrDefault,ft=Y.global.defaultColor;function gt(t){var e=this._view;return!!e&&Math.abs(t-e.x)<e.radius+e.hitRadius}Y._set("global",{elements:{point:{radius:3,pointStyle:"circle",backgroundColor:ft,borderColor:ft,borderWidth:1,hitRadius:1,hoverRadius:4,hoverBorderWidth:1}}});var mt=X.extend({_type:"point",inRange:function(t,e){var n=this._view;return!!n&&Math.pow(t-n.x,2)+Math.pow(e-n.y,2)<Math.pow(n.hitRadius+n.radius,2)},inLabelRange:gt,inXRange:gt,inYRange:function(t){var e=this._view;return!!e&&Math.abs(t-e.y)<e.radius+e.hitRadius},getCenterPoint:function(){var t=this._view;return{x:t.x,y:t.y}},getArea:function(){return Math.PI*Math.pow(this._view.radius,2)},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y,padding:t.radius+t.borderWidth}},draw:function(t){var e=this._view,n=this._chart.ctx,i=e.pointStyle,a=e.rotation,r=e.radius,o=e.x,s=e.y,l=Y.global,u=l.defaultColor;e.skip||(void 0===t||B.canvas._isPointInArea(e,t))&&(n.strokeStyle=e.borderColor||u,n.lineWidth=ct(e.borderWidth,l.elements.point.borderWidth),n.fillStyle=e.backgroundColor||u,B.canvas.drawPoint(n,i,r,o,s,a))}}),pt=Y.global.defaultColor;function vt(t){return t&&void 0!==t.width}function bt(t){var e,n,i,a,r;return vt(t)?(r=t.width/2,e=t.x-r,n=t.x+r,i=Math.min(t.y,t.base),a=Math.max(t.y,t.base)):(r=t.height/2,e=Math.min(t.x,t.base),n=Math.max(t.x,t.base),i=t.y-r,a=t.y+r),{left:e,top:i,right:n,bottom:a}}function yt(t,e,n){return t===e?n:t===n?e:t}function xt(t,e,n){var i,a,r,o,s=t.borderWidth,l=function(t){var e=t.borderSkipped,n={};return e?(t.horizontal?t.base>t.x&&(e=yt(e,"left","right")):t.base<t.y&&(e=yt(e,"bottom","top")),n[e]=!0,n):n}(t);return B.isObject(s)?(i=+s.top||0,a=+s.right||0,r=+s.bottom||0,o=+s.left||0):i=a=r=o=+s||0,{t:l.top||i<0?0:i>n?n:i,r:l.right||a<0?0:a>e?e:a,b:l.bottom||r<0?0:r>n?n:r,l:l.left||o<0?0:o>e?e:o}}function _t(t,e,n){var i=null===e,a=null===n,r=!(!t||i&&a)&&bt(t);return r&&(i||e>=r.left&&e<=r.right)&&(a||n>=r.top&&n<=r.bottom)}Y._set("global",{elements:{rectangle:{backgroundColor:pt,borderColor:pt,borderSkipped:"bottom",borderWidth:0}}});var wt=X.extend({_type:"rectangle",draw:function(){var t=this._chart.ctx,e=this._view,n=function(t){var e=bt(t),n=e.right-e.left,i=e.bottom-e.top,a=xt(t,n/2,i/2);return{outer:{x:e.left,y:e.top,w:n,h:i},inner:{x:e.left+a.l,y:e.top+a.t,w:n-a.l-a.r,h:i-a.t-a.b}}}(e),i=n.outer,a=n.inner;t.fillStyle=e.backgroundColor,t.fillRect(i.x,i.y,i.w,i.h),i.w===a.w&&i.h===a.h||(t.save(),t.beginPath(),t.rect(i.x,i.y,i.w,i.h),t.clip(),t.fillStyle=e.borderColor,t.rect(a.x,a.y,a.w,a.h),t.fill("evenodd"),t.restore())},height:function(){var t=this._view;return t.base-t.y},inRange:function(t,e){return _t(this._view,t,e)},inLabelRange:function(t,e){var n=this._view;return vt(n)?_t(n,t,null):_t(n,null,e)},inXRange:function(t){return _t(this._view,t,null)},inYRange:function(t){return _t(this._view,null,t)},getCenterPoint:function(){var t,e,n=this._view;return vt(n)?(t=n.x,e=(n.y+n.base)/2):(t=(n.x+n.base)/2,e=n.y),{x:t,y:e}},getArea:function(){var t=this._view;return vt(t)?t.width*Math.abs(t.y-t.base):t.height*Math.abs(t.x-t.base)},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y}}}),kt={},Mt=lt,St=ht,Dt=mt,Ct=wt;kt.Arc=Mt,kt.Line=St,kt.Point=Dt,kt.Rectangle=Ct;var Pt=B._deprecated,Tt=B.valueOrDefault;function Ot(t,e,n){var i,a,r=n.barThickness,o=e.stackCount,s=e.pixels[t],l=B.isNullOrUndef(r)?function(t,e){var n,i,a,r,o=t._length;for(a=1,r=e.length;a<r;++a)o=Math.min(o,Math.abs(e[a]-e[a-1]));for(a=0,r=t.getTicks().length;a<r;++a)i=t.getPixelForTick(a),o=a>0?Math.min(o,Math.abs(i-n)):o,n=i;return o}(e.scale,e.pixels):-1;return B.isNullOrUndef(r)?(i=l*n.categoryPercentage,a=n.barPercentage):(i=r*o,a=1),{chunk:i/o,ratio:a,start:s-i/2}}Y._set("bar",{hover:{mode:"label"},scales:{xAxes:[{type:"category",offset:!0,gridLines:{offsetGridLines:!0}}],yAxes:[{type:"linear"}]}}),Y._set("global",{datasets:{bar:{categoryPercentage:.8,barPercentage:.9}}});var At=at.extend({dataElementType:kt.Rectangle,_dataElementOptions:["backgroundColor","borderColor","borderSkipped","borderWidth","barPercentage","barThickness","categoryPercentage","maxBarThickness","minBarLength"],initialize:function(){var t,e,n=this;at.prototype.initialize.apply(n,arguments),(t=n.getMeta()).stack=n.getDataset().stack,t.bar=!0,e=n._getIndexScale().options,Pt("bar chart",e.barPercentage,"scales.[x/y]Axes.barPercentage","dataset.barPercentage"),Pt("bar chart",e.barThickness,"scales.[x/y]Axes.barThickness","dataset.barThickness"),Pt("bar chart",e.categoryPercentage,"scales.[x/y]Axes.categoryPercentage","dataset.categoryPercentage"),Pt("bar chart",n._getValueScale().options.minBarLength,"scales.[x/y]Axes.minBarLength","dataset.minBarLength"),Pt("bar chart",e.maxBarThickness,"scales.[x/y]Axes.maxBarThickness","dataset.maxBarThickness")},update:function(t){var e,n,i=this.getMeta().data;for(this._ruler=this.getRuler(),e=0,n=i.length;e<n;++e)this.updateElement(i[e],e,t)},updateElement:function(t,e,n){var i=this,a=i.getMeta(),r=i.getDataset(),o=i._resolveDataElementOptions(t,e);t._xScale=i.getScaleForId(a.xAxisID),t._yScale=i.getScaleForId(a.yAxisID),t._datasetIndex=i.index,t._index=e,t._model={backgroundColor:o.backgroundColor,borderColor:o.borderColor,borderSkipped:o.borderSkipped,borderWidth:o.borderWidth,datasetLabel:r.label,label:i.chart.data.labels[e]},B.isArray(r.data[e])&&(t._model.borderSkipped=null),i._updateElementGeometry(t,e,n,o),t.pivot()},_updateElementGeometry:function(t,e,n,i){var a=this,r=t._model,o=a._getValueScale(),s=o.getBasePixel(),l=o.isHorizontal(),u=a._ruler||a.getRuler(),d=a.calculateBarValuePixels(a.index,e,i),h=a.calculateBarIndexPixels(a.index,e,u,i);r.horizontal=l,r.base=n?s:d.base,r.x=l?n?s:d.head:h.center,r.y=l?h.center:n?s:d.head,r.height=l?h.size:void 0,r.width=l?void 0:h.size},_getStacks:function(t){var e,n,i=this._getIndexScale(),a=i._getMatchingVisibleMetas(this._type),r=i.options.stacked,o=a.length,s=[];for(e=0;e<o&&(n=a[e],(!1===r||-1===s.indexOf(n.stack)||void 0===r&&void 0===n.stack)&&s.push(n.stack),n.index!==t);++e);return s},getStackCount:function(){return this._getStacks().length},getStackIndex:function(t,e){var n=this._getStacks(t),i=void 0!==e?n.indexOf(e):-1;return-1===i?n.length-1:i},getRuler:function(){var t,e,n=this._getIndexScale(),i=[];for(t=0,e=this.getMeta().data.length;t<e;++t)i.push(n.getPixelForValue(null,t,this.index));return{pixels:i,start:n._startPixel,end:n._endPixel,stackCount:this.getStackCount(),scale:n}},calculateBarValuePixels:function(t,e,n){var i,a,r,o,s,l,u,d=this.chart,h=this._getValueScale(),c=h.isHorizontal(),f=d.data.datasets,g=h._getMatchingVisibleMetas(this._type),m=h._parseValue(f[t].data[e]),p=n.minBarLength,v=h.options.stacked,b=this.getMeta().stack,y=void 0===m.start?0:m.max>=0&&m.min>=0?m.min:m.max,x=void 0===m.start?m.end:m.max>=0&&m.min>=0?m.max-m.min:m.min-m.max,_=g.length;if(v||void 0===v&&void 0!==b)for(i=0;i<_&&(a=g[i]).index!==t;++i)a.stack===b&&(r=void 0===(u=h._parseValue(f[a.index].data[e])).start?u.end:u.min>=0&&u.max>=0?u.max:u.min,(m.min<0&&r<0||m.max>=0&&r>0)&&(y+=r));return o=h.getPixelForValue(y),l=(s=h.getPixelForValue(y+x))-o,void 0!==p&&Math.abs(l)<p&&(l=p,s=x>=0&&!c||x<0&&c?o-p:o+p),{size:l,base:o,head:s,center:s+l/2}},calculateBarIndexPixels:function(t,e,n,i){var a="flex"===i.barThickness?function(t,e,n){var i,a=e.pixels,r=a[t],o=t>0?a[t-1]:null,s=t<a.length-1?a[t+1]:null,l=n.categoryPercentage;return null===o&&(o=r-(null===s?e.end-e.start:s-r)),null===s&&(s=r+r-o),i=r-(r-Math.min(o,s))/2*l,{chunk:Math.abs(s-o)/2*l/e.stackCount,ratio:n.barPercentage,start:i}}(e,n,i):Ot(e,n,i),r=this.getStackIndex(t,this.getMeta().stack),o=a.start+a.chunk*r+a.chunk/2,s=Math.min(Tt(i.maxBarThickness,1/0),a.chunk*a.ratio);return{base:o-s/2,head:o+s/2,center:o,size:s}},draw:function(){var t=this.chart,e=this._getValueScale(),n=this.getMeta().data,i=this.getDataset(),a=n.length,r=0;for(B.canvas.clipArea(t.ctx,t.chartArea);r<a;++r){var o=e._parseValue(i.data[r]);isNaN(o.min)||isNaN(o.max)||n[r].draw()}B.canvas.unclipArea(t.ctx)},_resolveDataElementOptions:function(){var t=this,e=B.extend({},at.prototype._resolveDataElementOptions.apply(t,arguments)),n=t._getIndexScale().options,i=t._getValueScale().options;return e.barPercentage=Tt(n.barPercentage,e.barPercentage),e.barThickness=Tt(n.barThickness,e.barThickness),e.categoryPercentage=Tt(n.categoryPercentage,e.categoryPercentage),e.maxBarThickness=Tt(n.maxBarThickness,e.maxBarThickness),e.minBarLength=Tt(i.minBarLength,e.minBarLength),e}}),Ft=B.valueOrDefault,It=B.options.resolve;Y._set("bubble",{hover:{mode:"single"},scales:{xAxes:[{type:"linear",position:"bottom",id:"x-axis-0"}],yAxes:[{type:"linear",position:"left",id:"y-axis-0"}]},tooltips:{callbacks:{title:function(){return""},label:function(t,e){var n=e.datasets[t.datasetIndex].label||"",i=e.datasets[t.datasetIndex].data[t.index];return n+": ("+t.xLabel+", "+t.yLabel+", "+i.r+")"}}}});var Lt=at.extend({dataElementType:kt.Point,_dataElementOptions:["backgroundColor","borderColor","borderWidth","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth","hoverRadius","hitRadius","pointStyle","rotation"],update:function(t){var e=this,n=e.getMeta().data;B.each(n,(function(n,i){e.updateElement(n,i,t)}))},updateElement:function(t,e,n){var i=this,a=i.getMeta(),r=t.custom||{},o=i.getScaleForId(a.xAxisID),s=i.getScaleForId(a.yAxisID),l=i._resolveDataElementOptions(t,e),u=i.getDataset().data[e],d=i.index,h=n?o.getPixelForDecimal(.5):o.getPixelForValue("object"==typeof u?u:NaN,e,d),c=n?s.getBasePixel():s.getPixelForValue(u,e,d);t._xScale=o,t._yScale=s,t._options=l,t._datasetIndex=d,t._index=e,t._model={backgroundColor:l.backgroundColor,borderColor:l.borderColor,borderWidth:l.borderWidth,hitRadius:l.hitRadius,pointStyle:l.pointStyle,rotation:l.rotation,radius:n?0:l.radius,skip:r.skip||isNaN(h)||isNaN(c),x:h,y:c},t.pivot()},setHoverStyle:function(t){var e=t._model,n=t._options,i=B.getHoverColor;t.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth,radius:e.radius},e.backgroundColor=Ft(n.hoverBackgroundColor,i(n.backgroundColor)),e.borderColor=Ft(n.hoverBorderColor,i(n.borderColor)),e.borderWidth=Ft(n.hoverBorderWidth,n.borderWidth),e.radius=n.radius+n.hoverRadius},_resolveDataElementOptions:function(t,e){var n=this,i=n.chart,a=n.getDataset(),r=t.custom||{},o=a.data[e]||{},s=at.prototype._resolveDataElementOptions.apply(n,arguments),l={chart:i,dataIndex:e,dataset:a,datasetIndex:n.index};return n._cachedDataOpts===s&&(s=B.extend({},s)),s.radius=It([r.radius,o.r,n._config.radius,i.options.elements.point.radius],l,e),s}}),Rt=B.valueOrDefault,Nt=Math.PI,Wt=2*Nt,Yt=Nt/2;Y._set("doughnut",{animation:{animateRotate:!0,animateScale:!1},hover:{mode:"single"},legendCallback:function(t){var e,n,i,a=document.createElement("ul"),r=t.data,o=r.datasets,s=r.labels;if(a.setAttribute("class",t.id+"-legend"),o.length)for(e=0,n=o[0].data.length;e<n;++e)(i=a.appendChild(document.createElement("li"))).appendChild(document.createElement("span")).style.backgroundColor=o[0].backgroundColor[e],s[e]&&i.appendChild(document.createTextNode(s[e]));return a.outerHTML},legend:{labels:{generateLabels:function(t){var e=t.data;return e.labels.length&&e.datasets.length?e.labels.map((function(n,i){var a=t.getDatasetMeta(0),r=a.controller.getStyle(i);return{text:n,fillStyle:r.backgroundColor,strokeStyle:r.borderColor,lineWidth:r.borderWidth,hidden:isNaN(e.datasets[0].data[i])||a.data[i].hidden,index:i}})):[]}},onClick:function(t,e){var n,i,a,r=e.index,o=this.chart;for(n=0,i=(o.data.datasets||[]).length;n<i;++n)(a=o.getDatasetMeta(n)).data[r]&&(a.data[r].hidden=!a.data[r].hidden);o.update()}},cutoutPercentage:50,rotation:-Yt,circumference:Wt,tooltips:{callbacks:{title:function(){return""},label:function(t,e){var n=e.labels[t.index],i=": "+e.datasets[t.datasetIndex].data[t.index];return B.isArray(n)?(n=n.slice())[0]+=i:n+=i,n}}}});var zt=at.extend({dataElementType:kt.Arc,linkScales:B.noop,_dataElementOptions:["backgroundColor","borderColor","borderWidth","borderAlign","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth"],getRingIndex:function(t){for(var e=0,n=0;n<t;++n)this.chart.isDatasetVisible(n)&&++e;return e},update:function(t){var e,n,i,a,r=this,o=r.chart,s=o.chartArea,l=o.options,u=1,d=1,h=0,c=0,f=r.getMeta(),g=f.data,m=l.cutoutPercentage/100||0,p=l.circumference,v=r._getRingWeight(r.index);if(p<Wt){var b=l.rotation%Wt,y=(b+=b>=Nt?-Wt:b<-Nt?Wt:0)+p,x=Math.cos(b),_=Math.sin(b),w=Math.cos(y),k=Math.sin(y),M=b<=0&&y>=0||y>=Wt,S=b<=Yt&&y>=Yt||y>=Wt+Yt,D=b<=-Yt&&y>=-Yt||y>=Nt+Yt,C=b===-Nt||y>=Nt?-1:Math.min(x,x*m,w,w*m),P=D?-1:Math.min(_,_*m,k,k*m),T=M?1:Math.max(x,x*m,w,w*m),O=S?1:Math.max(_,_*m,k,k*m);u=(T-C)/2,d=(O-P)/2,h=-(T+C)/2,c=-(O+P)/2}for(i=0,a=g.length;i<a;++i)g[i]._options=r._resolveDataElementOptions(g[i],i);for(o.borderWidth=r.getMaxBorderWidth(),e=(s.right-s.left-o.borderWidth)/u,n=(s.bottom-s.top-o.borderWidth)/d,o.outerRadius=Math.max(Math.min(e,n)/2,0),o.innerRadius=Math.max(o.outerRadius*m,0),o.radiusLength=(o.outerRadius-o.innerRadius)/(r._getVisibleDatasetWeightTotal()||1),o.offsetX=h*o.outerRadius,o.offsetY=c*o.outerRadius,f.total=r.calculateTotal(),r.outerRadius=o.outerRadius-o.radiusLength*r._getRingWeightOffset(r.index),r.innerRadius=Math.max(r.outerRadius-o.radiusLength*v,0),i=0,a=g.length;i<a;++i)r.updateElement(g[i],i,t)},updateElement:function(t,e,n){var i=this,a=i.chart,r=a.chartArea,o=a.options,s=o.animation,l=(r.left+r.right)/2,u=(r.top+r.bottom)/2,d=o.rotation,h=o.rotation,c=i.getDataset(),f=n&&s.animateRotate?0:t.hidden?0:i.calculateCircumference(c.data[e])*(o.circumference/Wt),g=n&&s.animateScale?0:i.innerRadius,m=n&&s.animateScale?0:i.outerRadius,p=t._options||{};B.extend(t,{_datasetIndex:i.index,_index:e,_model:{backgroundColor:p.backgroundColor,borderColor:p.borderColor,borderWidth:p.borderWidth,borderAlign:p.borderAlign,x:l+a.offsetX,y:u+a.offsetY,startAngle:d,endAngle:h,circumference:f,outerRadius:m,innerRadius:g,label:B.valueAtIndexOrDefault(c.label,e,a.data.labels[e])}});var v=t._model;n&&s.animateRotate||(v.startAngle=0===e?o.rotation:i.getMeta().data[e-1]._model.endAngle,v.endAngle=v.startAngle+v.circumference),t.pivot()},calculateTotal:function(){var t,e=this.getDataset(),n=this.getMeta(),i=0;return B.each(n.data,(function(n,a){t=e.data[a],isNaN(t)||n.hidden||(i+=Math.abs(t))})),i},calculateCircumference:function(t){var e=this.getMeta().total;return e>0&&!isNaN(t)?Wt*(Math.abs(t)/e):0},getMaxBorderWidth:function(t){var e,n,i,a,r,o,s,l,u=0,d=this.chart;if(!t)for(e=0,n=d.data.datasets.length;e<n;++e)if(d.isDatasetVisible(e)){t=(i=d.getDatasetMeta(e)).data,e!==this.index&&(r=i.controller);break}if(!t)return 0;for(e=0,n=t.length;e<n;++e)a=t[e],r?(r._configure(),o=r._resolveDataElementOptions(a,e)):o=a._options,"inner"!==o.borderAlign&&(s=o.borderWidth,u=(l=o.hoverBorderWidth)>(u=s>u?s:u)?l:u);return u},setHoverStyle:function(t){var e=t._model,n=t._options,i=B.getHoverColor;t.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth},e.backgroundColor=Rt(n.hoverBackgroundColor,i(n.backgroundColor)),e.borderColor=Rt(n.hoverBorderColor,i(n.borderColor)),e.borderWidth=Rt(n.hoverBorderWidth,n.borderWidth)},_getRingWeightOffset:function(t){for(var e=0,n=0;n<t;++n)this.chart.isDatasetVisible(n)&&(e+=this._getRingWeight(n));return e},_getRingWeight:function(t){return Math.max(Rt(this.chart.data.datasets[t].weight,1),0)},_getVisibleDatasetWeightTotal:function(){return this._getRingWeightOffset(this.chart.data.datasets.length)}});Y._set("horizontalBar",{hover:{mode:"index",axis:"y"},scales:{xAxes:[{type:"linear",position:"bottom"}],yAxes:[{type:"category",position:"left",offset:!0,gridLines:{offsetGridLines:!0}}]},elements:{rectangle:{borderSkipped:"left"}},tooltips:{mode:"index",axis:"y"}}),Y._set("global",{datasets:{horizontalBar:{categoryPercentage:.8,barPercentage:.9}}});var Et=At.extend({_getValueScaleId:function(){return this.getMeta().xAxisID},_getIndexScaleId:function(){return this.