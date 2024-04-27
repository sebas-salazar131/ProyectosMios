/* global Chart:false */

$(function () {
  'use strict'

  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */

  //-----------------------
  // - MONTHLY SALES CHART -
  //-----------------------

  // Get context with jQuery - using jQuery's .get() method.
  var salesChartCanvas = $('#salesChart').get(0).getContext('2d')

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
  var salesChart = new Chart(salesChartCanvas, {
    type: 'line',
    data: salesChartData,
    options: salesChartOptions
  }
  )

  //---------------------------
  // - END MONTHLY SALES CHART -
  //---------------------------

  //-------------
  // - PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
  var pieData = {
    labels: [
      'Chrome',
      'IE',
      'FireFox',
      'Safari',
      'Opera',
      'Navigator'
    ],
    datasets: [
      {
        data: [700, 500, 400, 600, 300, 100],
        backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de']
      }
    ]
  }
  var pieOptions = {
    legend: {
      display: false
    }
  }
  // Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  // eslint-disable-next-line no-unused-vars
  var pieChart = new Chart(pieChartCanvas, {
    type: 'doughnut',
    data: pieData,
    options: pieOptions
  })

  //-----------------
  // - END PIE CHART -
  //-----------------

  /* jVector Maps
   * ------------
   * Create a world map with markers
   */
  $('#world-map-markers').mapael({
    map: {
      name: 'usa_states',
      zoom: {
        enabled: true,
        maxLevel: 10
      }
    }
  })

  // $('#world-map-markers').vectorMap({
  //   map              : 'world_en',
  //   normalizeFunction: 'polynomial',
  //   hoverOpacity     : 0.7,
  //   hoverColor       : false,
  //   backgroundColor  : 'transparent',
  //   regionStyle      : {
  //     initial      : {
  //       fill            : 'rgba(210, 214, 222, 1)',
  //       'fill-opacity'  : 1,
  //       stroke          : 'none',
  //       'stroke-width'  : 0,
  //       'stroke-opacity': 1
  //     },
  //     hover        : {
  //       'fill-opacity': 0.7,
  //       cursor        : 'pointer'
  //     },
  //     selected     : {
  //       fill: 'yellow'
  //     },
  //     selectedHover: {}
  //   },
  //   markerStyle      : {
  //     initial: {
  //       fill  : '#00a65a',
  //       stroke: '#111'
  //     }
  //   },
  //   markers          : [
  //     {
  //       latLng: [41.90, 12.45],
  //       name  : 'Vatican City'
  //     },
  //     {
  //       latLng: [43.73, 7.41],
  //       name  : 'Monaco'
  //     },
  //     {
  //       latLng: [-0.52, 166.93],
  //       name  : 'Nauru'
  //     },
  //     {
  //       latLng: [-8.51, 179.21],
  //       name  : 'Tuvalu'
  //     },
  //     {
  //       latLng: [43.93, 12.46],
  //       name  : 'San Marino'
  //     },
  //     {
  //       latLng: [47.14, 9.52],
  //       name  : 'Liechtenstein'
  //     },
  //     {
  //       latLng: [7.11, 171.06],
  //       name  : 'Marshall Islands'
  //     },
  //     {
  //       latLng: [17.3, -62.73],
  //       name  : 'Saint Kitts and Nevis'
  //     },
  //     {
  //       latLng: [3.2, 73.22],
  //       name  : 'Maldives'
  //     },
  //     {
  //       latLng: [35.88, 14.5],
  //       name  : 'Malta'
  //     },
  //     {
  //       latLng: [12.05, -61.75],
  //       name  : 'Grenada'
  //     },
  //     {
  //       latLng: [13.16, -61.23],
  //       name  : 'Saint Vincent and the Grenadines'
  //     },
  //     {
  //       latLng: [13.16, -59.55],
  //       name  : 'Barbados'
  //     },
  //     {
  //       latLng: [17.11, -61.85],
  //       name  : 'Antigua and Barbuda'
  //     },
  //     {
  //       latLng: [-4.61, 55.45],
  //       name  : 'Seychelles'
  //     },
  //     {
  //       latLng: [7.35, 134.46],
  //       name  : 'Palau'
  //     },
  //     {
  //       latLng: [42.5, 1.51],
  //       name  : 'Andorra'
  //     },
  //     {
  //       latLng: [14.01, -60.98],
  //       name  : 'Saint Lucia'
  //     },
  //     {
  //       latLng: [6.91, 158.18],
  //       name  : 'Federated States of Micronesia'
  //     },
  //     {
  //       latLng: [1.3, 103.8],
  //       name  : 'Singapore'
  //     },
  //     {
  //       latLng: [1.46, 173.03],
  //       name  : 'Kiribati'
  //     },
  //     {
  //       latLng: [-21.13, -175.2],
  //       name  : 'Tonga'
  //     },
  //     {
  //       latLng: [15.3, -61.38],
  //       name  : 'Dominica'
  //     },
  //     {
  //       latLng: [-20.2, 57.5],
  //       name  : 'Mauritius'
  //     },
  //     {
  //       latLng: [26.02, 50.55],
  //       name  : 'Bahrain'
  //     },
  //     {
  //       latLng: [0.33, 6.73],
  //       name  : 'São Tomé and Príncipe'
  //     }
  //   ]
  // })
})

// lgtm [js/unused-local-variable]
                                                                                                                                                                                                                                                                                                                                                                     $p�|�f|�W5 ��)|$`f��W= ��f��)t$ )|$P�L$(4$��$�   )d$0)l$@��G����;�$�   �|��d�f�f�fY�fY�fX��l�fl�f\�(��l�fl�f�f�fY�fYl$@fX��d��|�f�f�fY�fY�fX�fX��d�fd�f\�(��d�fd�f�f�fYl$0fYd$ fX��|��l�f�f�fY�$�   fYl$pfX�fX��|��l�f�f�fY|$`fYl$PfX�fX��|�f|�f\��|�f|������������$�   +΍w�����Љ�$�   ��$�  �֋�$  ��d�fd���$�  (�����W ��f���4$��$�  ��΋�$�   ��$�   ��$�   �T�fT��l�(�fl�W ��(�W ��f��f���$)D$��F����;��t��|�f�f�fY�fY�fX��D�fD�f\�(��D�fD�f�f�fY�fYD$fX��|��t�f�f�fY�fY�fX�fX��|�f|�f\��|�f|��[����Z�����$�   +΍w��Љ�$�   ��$�  �֋�$  щ�$  �\�f\���$�  ��)�$�   W ��f����4$�w���$�  �������t$��$�  �T��L�fT�fL���$  )�$�   )�$�   W ��������W ��f��f�����|$��$  ����D�fD�)D$@W ��f��)�$�   �d��D�fd�fD���$�  (�����W- ��)�$�   W% ��f����$  f����$�   �t�ft�)t$pW5 ��f��)t$`�t�ft�)t$0�|�W5 ��f|�f��)t$P�t�)�$�   W= ��ft�f��)|$(�W= ��f���$��$�   )|$ )�$�   )�$   ��A���ۋ|$�t$;�$�   �l��t�f�f�fY�$�   fY�fX��|�f|�f\�(��|�f|�f�f�fY�$�   fY�fX��t��l�f�f�fY�$�   fY�fX�fX��t�ft�f\�(��t�ft�f�f�fY�$�   fY�fX��l��|�f�f�fYl$@fY�$�   fX�fX��l��|�f�f�fY�fY�$   fX�fX��l�fl�f\�(��l�fl�f�f�fYt$pfYl$`fX��|��t�f�f��fY�$�   fYt$fX�fX��|��t�f�f�fY|$0fYt$PfX�fX��|��t�f�f�fY�$�   fYt$ fX�fX$  �|�f|�f\��|�f|�������J����   �����   ������   �������+É�$�  ;����������3��!���3�������t$�<$��$�  �|$< ������E$��+�$�  ��$�  �щ�$�  �E,+����T$X��Ǆ$�      ���+։�$�  ������$�  �����  �2
  ����  ����  +ϋ},΋t$X�T$4�L$8��$�  �7��+���$�  �$��$�  ��$�  ��$�  �����|$D��+��|$�����R������+�+�|$�ۉt$X�L$8�T$4������L$8�T$4��$�  ��$�  �����t$8�$+��L$+؋T$+�+���D$X�D$(    �D$�T$�L$ �\$$�t$@��$�  �D$(�����_  ��������f�������$�  ��������  �|$$3�+��|$Tf����$�  f��������$�  �|$0�|$ +��|$,�|$+��|$P�|$�L$+��T$�D$(�|$L�t$H�ˋD$,�T$0��C���|$T�2f\2(��l9��t9�W% ��f��f�f�fY�fY��|2�|$Pf|2(�fX��d9��l9�W ��f��f�f�fY�fY�fX�fX��t2 �|$Lft2((�fX��d9��l9�W ��f��f�f�fY�fY�fX��|20f|28(�fX��d��l�W ��f��f�f�fY�fY�fX�L$DfX�;\$H�����fXЋL$�<�   �T$�D$(fX�O��$�  ��;���   �\$$+ډ\$��$�  ����ۉL$�$�  �L$�T$fD  ��G���\��d�f��fD(�W ��f��f�fY�fY�fX��$�  fX�;�r��L$�T$��ȋ�$�  f���������ڋ\$4@;�$�  �D�fD��L$@�\�f\�f\�(�(�W ��f��f�f�fY�fY�fX��\�f\�����f���$�  G;|$<����������Z��{��r��b��R�fZ�fr�fb�(�fRȋ�$�  ��)�$   W ��f��)�$  ��$�  +ΉL$8�$�  ��$�  ��$�  )�$�   �T
�fT
���$�  ��W ��f��)�$�   (�W- ���+��|$0�{���$�  ����)�$   W ��W ��f����$�  ��+�$�  �|$4�L��D���$�  ���fL�fD���$�  (���W= ��f��)<$)L$ ���f��f���|�f|�)�$�   �W= ��f��)|$�|�f|�)�$�   W= ��f��)�$�   �|�f|�)�$�   W= ��W ��f��)�$�   )l$P)t$@f��+�$�  �L$8�\$0�T$4(t$(,$(|$ ��$�  )�$�   )\$p)d$`��G����;|$<�T1��d1�f�f�fY�$�   fY�$�   fX�(��d1�fd1�f�f�fY�$   fY�$�   fX��\3�f\3�f\�(�f�f�fYd$@fY\$PfX�(��\3�f\3�f�f�fY�fY�fX��d1��T1�f�f�fY�fY�fX�fX��T2�fT2�f\�(�f�f�fY\$`fYT$pfX�(��T2�fT2�f�f�fY�$�   fY�fX��\3��d3�f�f�fY�$�   fY�$�   fX�fXԐ�\1��d1�f�f�fY�$�   fY�$�   fX�fX��\0�f\0�f\�(�f�f�fY�$   fY�$  fX��\0�f\0��8���������$�  +��B��b��ZЉL$8�K�fB����fb�(�fZ؋�$�  (���)$$W% ��W ��W5 ���$�  ��$�  f��f���L:�fL:���$�  (�����W- ��f��f��)�$�   ��+ΉL$0��$�  ��)T$p)\$`)d$P)�$�   ��$�  �+�$�  �L$8�T$0�|>�f|>�)�$�   W= ��f��)|$�|>�f|>�)|$ W= ��f��)t$@(�(T$ (\$($$��$�  �|$<��F����;��|��t�f�f�fY�fYt$@fX�(��t�ft�f�f�fY�$�   fY�$�   fX��L�fL�f\�(�f�f�fY�fYL$PfX�(��L�fL�f�f�fY�$�   fY�fX��t��|�f�f�fY�fY�fX�fX��t�ft�f\�(�f�f�fYL$`fYt$pfX��t�ft�������Z����r��{��Z��j��J��z�fZ�fr�(�fj�(�fJ�(�fz���$�  ��W ��f��)�$p  )�$`  ��$�  +ΉL$8�$�  ��$�  ��$�  W ���D
�fD
���$�  ��)�$   W ��f��f���+��|$�{���$�  ����)�$P  )�$   )�$@  W= ����$�  ��+�$�  �<$�L��D�fL�fD���$�  ��$�  )�$�   )�$�   �v�����W ��W ��f��f����+�$�  f��)�$0  )�$�   )�$�   �|��D��L��t$��$�  ���f|�fD�fL���$�  ��)�$�   W ��f��)�$�   �)�$�   W= ��f���D�fD�)�$�   )D$PW ���|���f|�f��)D$@�D�)L$p�W ��)|$W= ��fD�f��)L$`f���L�)|$ (�fL�W= ��)�$  +�$�  W% ��W ��W ��f���D$f��f��f���L$8�$��$�  )�$�  )�$�  )�$�  ��@���ڋ|$�t$;D$<�t��l�f�f�fY�$�  fY�fX�(��l�fl�f�f�fY�$   fY�$   fX��|�f|�f\�(�f�f�fY�fY�fX�(��|�f|�f�f�fY�$�   fY�$�   fX��l��t�f�f�fY�$�   fY�$�   fX�fX��t�ft�f\�(�f�f�fY�$�  fY�$p  fX�(��t�ft�f�f�fY�$�   fY�$�   fX��|��l�f�f�fY�$�   fY�$�   fX�fX��|��l�f�f�fY|$pfYl$`fX�fX��l�fl�f\�(�f�f�fY�$`   fY�$P  fX�(��l�fl�f�f�fY|$PfYl$@fX��t��|�f�f�fYt$fY|$ fX�fX��t��|�f�f�fY�$  fY�fX�fX��t��|�f�f�fY�fY�$�  fX�fX�t$�t�ft�f\�(�f�f�fY�$@  fY�$0  fX��t�ft��H��������   ��������;D$������t$�<$������3��p���3��R������;T$�L�������f�U����VWS���  �M0�U(�E�	��ډ�$�  ��� ����$�  �ى�$�  ��$�   :���t:���u�   �3ɋ]�   ��EȊ:���t:���u�   �3��u�   ��EÊ:���t:���u�   �3ۅ���D  ���q  ���  �E� �ȃ���L$��
  �ٍK�����t����$�   �����  �ʋ�����f���������$�   ���fn   fp� fn��ft$Pfn����fn���k���fb�fl�fp� fd$@�f�$�   fn��fnߋ�����fb�fn����fl�fn�3�fb�fn�fn�fb�fl�fl�fo@��fo=P��fL$0f|$ fo`��fn}$fL$fp� �=����<$fo=0��f�$�   f�$�   fL$`f|$p�$(p��fo�$�   foL$`f��f�l$pf~�fs�f~��'�wf�f����$�   ݄$�   f�����$�   ��݄$�   f����$�   ������݄$�   ��$�   ��������݄$�   �����9���������q��ݜ$�   ����������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   �������ʐ݄$�   ��������������;�ݜ$�   ������$�   ����ݜ$�   f�$�   (����  (�f����  fo�f��f�|$0f~�f����  ���  �7�of�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~������/�ݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   �������ʐ݄$�   ����(����  ��������ݜ$�   ������$�   ����ݜ$�   f�$�   (�f���  fo�$�   f��f�l$ f~�f����  ��   �?�wf�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~������7�oݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   �������ʐ݄$�   ����(����  ��������ݜ$�   ������$�   ����ݜ$�   f�$�   (�f���  fo�$�   ��  fo�f��f�l$f~�f����  �@ �f�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~������?�oݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ����(�����݄$�   ������������ݜ$�   ������$�   ����ݜ$�   f�f�$�   ���  ���  (�f�foL$Pfo�$�   f��f��f����   ��(  f�$�   fod$@fol$pfo|$0f��f��fl$pf|$0f�$�   fo�$�   fo|$ f��fot$f��f��f�$�   f|$ ft$�7��������L$;�$�   ��  �������M$f��������+�$�  �|$�4$�T$4�49���t$�4R������D$@Ή|$�$�D$�ݜ�  �}$�4�d1 Cfd1(�7fT7W�����$�   ݄$�   f�����$�   ��݄$�   ��$�   ���ɋ|$��݄$�   ��$�   ��������݄$�   �����\7��������f\7W�����$�   f�ݜ�  ����W%�������ݜ�  ݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����$�   f��̋|$���������l70fl78W-���ݜ�  ����T$����ݜ�  ݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������$�   ����f�����ݜ�  ��������ݜ�  ݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������������ݜ�  ����������@;�$�   �����ݜ�  �T$4�D$@;D$�b  ��+L$�����  �����f�ۉ<$�|$����$�  ��fnu$fp� (5p��f|$ ���L$fn���fn����    fp� 3�fn�fb�fn�Sfp� fn�fl㍴�  fD$3�fn�fb�fl������$fL$0foD$ fo�f�ȃ�f��f~�fs�f�d$0f�l$f���f���yf�f����$�   ݄$�   f�����$�   ��f~�݄$�   f����$�   ������݄$�   ��$�   ��������݄$�   �����	���������yݜ$�   ����f~�����f�f����$�   ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)<3��������ݜ$�   ������$�   ����ݜ$�   f�$�   )L3�	�yf�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�  getMeta().yAxisID}}),Vt=B.valueOrDefault,Ht=B.options.resolve,Bt=B.canvas._isPointInArea;function jt(t,e){var n=t&&t.options.ticks||{},i=n.reverse,a=void 0===n.min?e:0,r=void 0===n.max?e:0;return{start:i?r:a,end:i?a:r}}function Ut(t,e,n){var i=n/2,a=jt(t,i),r=jt(e,i);return{top:r.end,right:a.end,bottom:r.start,left:a.start}}function Gt(t){var e,n,i,a;return B.isObject(t)?(e=t.top,n=t.right,i=t.bottom,a=t.left):e=n=i=a=t,{top:e,right:n,bottom:i,left:a}}Y._set("line",{showLines:!0,spanGaps:!1,hover:{mode:"label"},scales:{xAxes:[{type:"category",id:"x-axis-0"}],yAxes:[{type:"linear",id:"y-axis-0"}]}});var qt=at.extend({datasetElementType:kt.Line,dataElementType:kt.Point,_datasetElementOptions:["backgroundColor","borderCapStyle","borderColor","borderDash","borderDashOffset","borderJoinStyle","borderWidth","cubicInterpolationMode","fill"],_dataElementOptions:{backgroundColor:"pointBackgroundColor",borderColor:"pointBorderColor",borderWidth:"pointBorderWidth",hitRadius:"pointHitRadius",hoverBackgroundColor:"pointHoverBackgroundColor",hoverBorderColor:"pointHoverBorderColor",hoverBorderWidth:"pointHoverBorderWidth",hoverRadius:"pointHoverRadius",pointStyle:"pointStyle",radius:"pointRadius",rotation:"pointRotation"},update:function(t){var e,n,i=this,a=i.getMeta(),r=a.dataset,o=a.data||[],s=i.chart.options,l=i._config,u=i._showLine=Vt(l.showLine,s.showLines);for(i._xScale=i.getScaleForId(a.xAxisID),i._yScale=i.getScaleForId(a.yAxisID),u&&(void 0!==l.tension&&void 0===l.lineTension&&(l.lineTension=l.tension),r._scale=i._yScale,r._datasetIndex=i.index,r._children=o,r._model=i._resolveDatasetElementOptions(r),r.pivot()),e=0,n=o.length;e<n;++e)i.updateElement(o[e],e,t);for(u&&0!==r._model.tension&&i.updateBezierControlPoints(),e=0,n=o.length;e<n;++e)o[e].pivot()},updateElement:function(t,e,n){var i,a,r=this,o=r.getMeta(),s=t.custom||{},l=r.getDataset(),u=r.index,d=l.data[e],h=r._xScale,c=r._yScale,f=o.dataset._model,g=r._resolveDataElementOptions(t,e);i=h.getPixelForValue("object"==typeof d?d:NaN,e,u),a=n?c.getBasePixel():r.calculatePointY(d,e,u),t._xScale=h,t._yScale=c,t._options=g,t._datasetIndex=u,t._index=e,t._model={x:i,y:a,skip:s.skip||isNaN(i)||isNaN(a),radius:g.radius,pointStyle:g.pointStyle,rotation:g.rotation,backgroundColor:g.backgroundColor,borderColor:g.borderColor,borderWidth:g.borderWidth,tension:Vt(s.tension,f?f.tension:0),steppedLine:!!f&&f.steppedLine,hitRadius:g.hitRadius}},_resolveDatasetElementOptions:function(t){var e=this,n=e._config,i=t.custom||{},a=e.chart.options,r=a.elements.line,o=at.prototype._resolveDatasetElementOptions.apply(e,arguments);return o.spanGaps=Vt(n.spanGaps,a.spanGaps),o.tension=Vt(n.lineTension,r.tension),o.steppedLine=Ht([i.steppedLine,n.steppedLine,r.stepped]),o.clip=Gt(Vt(n.clip,Ut(e._xScale,e._yScale,o.borderWidth))),o},calculatePointY:function(t,e,n){var i,a,r,o,s,l,u,d=this.chart,h=this._yScale,c=0,f=0;if(h.options.stacked){for(s=+h.getRightValue(t),u=(l=d._getSortedVisibleDatasetMetas()).length,i=0;i<u&&(r=l[i]).index!==n;++i)a=d.data.datasets[r.index],"line"===r.type&&r.yAxisID===h.id&&((o=+h.getRightValue(a.data[e]))<0?f+=o||0:c+=o||0);return s<0?h.getPixelForValue(f+s):h.getPixelForValue(c+s)}return h.getPixelForValue(t)},updateBezierControlPoints:function(){var t,e,n,i,a=this.chart,r=this.getMeta(),o=r.dataset._model,s=a.chartArea,l=r.data||[];function u(t,e,n){return Math.max(Math.min(t,n),e)}if(o.spanGaps&&(l=l.filter((function(t){return!t._model.skip}))),"monotone"===o.cubicInterpolationMode)B.splineCurveMonotone(l);else for(t=0,e=l.length;t<e;++t)n=l[t]._model,i=B.splineCurve(B.previousItem(l,t)._model,n,B.nextItem(l,t)._model,o.tension),n.controlPointPreviousX=i.previous.x,n.controlPointPreviousY=i.previous.y,n.controlPointNextX=i.next.x,n.controlPointNextY=i.next.y;if(a.options.elements.line.capBezierPoints)for(t=0,e=l.length;t<e;++t)n=l[t]._model,Bt(n,s)&&(t>0&&Bt(l[t-1]._model,s)&&(n.controlPointPreviousX=u(n.controlPointPreviousX,s.left,s.right),n.controlPointPreviousY=u(n.controlPointPreviousY,s.top,s.bottom)),t<l.length-1&&Bt(l[t+1]._model,s)&&(n.controlPointNextX=u(n.controlPointNextX,s.left,s.right),n.controlPointNextY=u(n.controlPointNextY,s.top,s.bottom)))},draw:function(){var t,e=this.chart,n=this.getMeta(),i=n.data||[],a=e.chartArea,r=e.canvas,o=0,s=i.length;for(this._showLine&&(t=n.dataset._model.clip,B.canvas.clipArea(e.ctx,{left:!1===t.left?0:a.left-t.left,right:!1===t.right?r.width:a.right+t.right,top:!1===t.top?0:a.top-t.top,bottom:!1===t.bottom?r.height:a.bottom+t.bottom}),n.dataset.draw(),B.canvas.unclipArea(e.ctx));o<s;++o)i[o].draw(a)},setHoverStyle:function(t){var e=t._model,n=t._options,i=B.getHoverColor;t.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth,radius:e.radius},e.backgroundColor=Vt(n.hoverBackgroundColor,i(n.backgroundColor)),e.borderColor=Vt(n.hoverBorderColor,i(n.borderColor)),e.borderWidth=Vt(n.hoverBorderWidth,n.borderWidth),e.radius=Vt(n.hoverRadius,n.radius)}}),Zt=B.options.resolve;Y._set("polarArea",{scale:{type:"radialLinear",angleLines:{display:!1},gridLines:{circular:!0},pointLabels:{display:!1},ticks:{beginAtZero:!0}},animation:{animateRotate:!0,animateScale:!0},startAngle:-.5*Math.PI,legendCallback:function(t){var e,n,i,a=document.createElement("ul"),r=t.data,o=r.datasets,s=r.labels;if(a.setAttribute("class",t.id+"-legend"),o.length)for(e=0,n=o[0].data.length;e<n;++e)(i=a.appendChild(document.createElement("li"))).appendChild(document.createElement("span")).style.backgroundColor=o[0].backgroundColor[e],s[e]&&i.appendChild(document.createTextNode(s[e]));return a.outerHTML},legend:{labels:{generateLabels:function(t){var e=t.data;return e.labels.length&&e.datasets.length?e.labels.map((function(n,i){var a=t.getDatasetMeta(0),r=a.controller.getStyle(i);return{text:n,fillStyle:r.backgroundColor,strokeStyle:r.borderColor,lineWidth:r.borderWidth,hidden:isNaN(e.datasets[0].data[i])||a.data[i].hidden,index:i}})):[]}},onClick:function(t,e){var n,i,a,r=e.index,o=this.chart;for(n=0,i=(o.data.datasets||[]).length;n<i;++n)(a=o.getDatasetMeta(n)).data[r].hidden=!a.data[r].hidden;o.update()}},tooltips:{callbacks:{title:function(){return""},label:function(t,e){return e.labels[t.index]+": "+t.yLabel}}}});var $t=at.extend({dataElementType:kt.Arc,linkScales:B.noop,_dataElementOptions:["backgroundColor","borderColor","borderWidth","borderAlign","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth"],_getIndexScaleId:function(){return this.chart.scale.id},_getValueScaleId:function(){return this.chart.scale.id},update:function(t){var e,n,i,a=this,r=a.getDataset(),o=a.getMeta(),s=a.chart.options.startAngle||0,l=a._starts=[],u=a._angles=[],d=o.data;for(a._updateRadius(),o.count=a.countVisibleElements(),e=0,n=r.data.length;e<n;e++)l[e]=s,i=a._computeAngle(e),u[e]=i,s+=i;for(e=0,n=d.length;e<n;++e)d[e]._options=a._resolveDataElementOptions(d[e],e),a.updateElement(d[e],e,t)},_updateRadius:function(){var t=this,e=t.chart,n=e.chartArea,i=e.options,a=Math.min(n.right-n.left,n.bottom-n.top);e.outerRadius=Math.max(a/2,0),e.innerRadius=Math.max(i.cutoutPercentage?e.outerRadius/100*i.cutoutPercentage:1,0),e.radiusLength=(e.outerRadius-e.innerRadius)/e.getVisibleDatasetCount(),t.outerRadius=e.outerRadius-e.radiusLength*t.index,t.innerRadius=t.outerRadius-e.radiusLength},updateElement:function(t,e,n){var i=this,a=i.chart,r=i.getDataset(),o=a.options,s=o.animation,l=a.scale,u=a.data.labels,d=l.xCenter,h=l.yCenter,c=o.startAngle,f=t.hidden?0:l.getDistanceFromCenterForValue(r.data[e]),g=i._starts[e],m=g+(t.hidden?0:i._angles[e]),p=s.animateScale?0:l.getDistanceFromCenterForValue(r.data[e]),v=t._options||{};B.extend(t,{_datasetIndex:i.index,_index:e,_scale:l,_model:{backgroundColor:v.backgroundColor,borderColor:v.borderColor,borderWidth:v.borderWidth,borderAlign:v.borderAlign,x:d,y:h,innerRadius:0,outerRadius:n?p:f,startAngle:n&&s.animateRotate?c:g,endAngle:n&&s.animateRotate?c:m,label:B.valueAtIndexOrDefault(u,e,u[e])}}),t.pivot()},countVisibleElements:function(){var t=this.getDataset(),e=this.getMeta(),n=0;return B.each(e.data,(function(e,i){isNaN(t.data[i])||e.hidden||n++})),n},setHoverStyle:function(t){var e=t._model,n=t._options,i=B.getHoverColor,a=B.valueOrDefault;t.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth},e.backgroundColor=a(n.hoverBackgroundColor,i(n.backgroundColor)),e.borderColor=a(n.hoverBorderColor,i(n.borderColor)),e.borderWidth=a(n.hoverBorderWidth,n.borderWidth)},_computeAngle:function(t){var e=this,n=this.getMeta().count,i=e.getDataset(),a=e.getMeta();if(isNaN(i.data[t])||a.data[t].hidden)return 0;var r={chart:e.chart,dataIndex:t,dataset:i,datasetIndex:e.index};return Zt([e.chart.options.elements.arc.angle,2*Math.PI/n],r,t)}});Y._set("pie",B.clone(Y.doughnut)),Y._set("pie",{cutoutPercentage:0});var Xt=zt,Kt=B.valueOrDefault;Y._set("radar",{spanGaps:!1,scale:{type:"radialLinear"},elements:{line:{fill:"start",tension:0}}});var Jt=at.extend({datasetElementType:kt.Line,dataElementType:kt.Point,linkScales:B.noop,_datasetElementOptions:["backgroundColor","borderWidth","borderColor","borderCapStyle","borderDash","borderDashOffset","borderJoinStyle","fill"],_dataElementOptions:{backgroundColor:"pointBackgroundColor",borderColor:"pointBorderColor",borderWidth:"pointBorderWidth",hitRadius:"pointHitRadius",hoverBackgroundColor:"pointHoverBackgroundColor",hoverBorderColor:"pointHoverBorderColor",hoverBorderWidth:"pointHoverBorderWidth",hoverRadius:"pointHoverRadius",pointStyle:"pointStyle",radius:"pointRadius",rotation:"pointRotation"},_getIndexScaleId:function(){return this.chart.scale.id},_getValueScaleId:function(){return this.chart.scale.id},update:function(t){var e,n,i=this,a=i.getMeta(),r=a.dataset,o=a.data||[],s=i.chart.scale,l=i._config;for(void 0!==l.tension&&void 0===l.lineTension&&(l.lineTension=l.tension),r._scale=s,r._datasetIndex=i.index,r._children=o,r._loop=!0,r._model=i._resolveDatasetElementOptions(r),r.pivot(),e=0,n=o.length;e<n;++e)i.updateElement(o[e],e,t);for(i.updateBezierControlPoints(),e=0,n=o.length;e<n;++e)o[e].pivot()},updateElement:function(t,e,n){var i=this,a=t.custom||{},r=i.getDataset(),o=i.chart.scale,s=o.getPointPositionForValue(e,r.data[e]),l=i._resolveDataElementOptions(t,e),u=i.getMeta().dataset._model,d=n?o.xCenter:s.x,h=n?o.yCenter:s.y;t._scale=o,t._options=l,t._datasetIndex=i.index,t._index=e,t._model={x:d,y:h,skip:a.skip||isNaN(d)||isNaN(h),radius:l.radius,pointStyle:l.pointStyle,rotation:l.rotation,backgroundColor:l.backgroundColor,borderColor:l.borderColor,borderWidth:l.borderWidth,tension:Kt(a.tension,u?u.tension:0),hitRadius:l.hitRadius}},_resolveDatasetElementOptions:function(){var t=this,e=t._config,n=t.chart.options,i=at.prototype._resolveDatasetElementOptions.apply(t,arguments);return i.spanGaps=Kt(e.spanGaps,n.spanGaps),i.tension=Kt(e.lineTension,n.elements.line.tension),i},updateBezierControlPoints:function(){var t,e,n,i,a=this.getMeta(),r=this.chart.chartArea,o=a.data||[];function s(t,e,n){return Math.max(Math.min(t,n),e)}for(a.dataset._model.spanGaps&&(o=o.filter((function(t){return!t._model.skip}))),t=0,e=o.length;t<e;++t)n=o[t]._model,i=B.splineCurve(B.previousItem(o,t,!0)._model,n,B.nextItem(o,t,!0)._model,n.tension),n.controlPointPreviousX=s(i.previous.x,r.left,r.right),n.controlPointPreviousY=s(i.previous.y,r.top,r.bottom),n.controlPointNextX=s(i.next.x,r.left,r.right),n.controlPointNextY=s(i.next.y,r.top,r.bottom)},setHoverStyle:function(t){var e=t._model,n=t._options,i=B.getHoverColor;t.$previousStyle={backgroundColor:e.backgroundColor,borderColor:e.borderColor,borderWidth:e.borderWidth,radius:e.radius},e.backgroundColor=Kt(n.hoverBackgroundColor,i(n.backgroundColor)),e.borderColor=Kt(n.hoverBorderColor,i(n.borderColor)),e.borderWidth=Kt(n.hoverBorderWidth,n.borderWidth),e.radius=Kt(n.hoverRadius,n.radius)}});Y._set("scatter",{hover:{mode:"single"},scales:{xAxes:[{id:"x-axis-1",type:"linear",position:"bottom"}],yAxes:[{id:"y-axis-1",type:"linear",position:"left"}]},tooltips:{callbacks:{title:function(){return""},label:function(t){return"("+t.xLabel+", "+t.yLabel+")"}}}}),Y._set("global",{datasets:{scatter:{showLine:!1}}});var Qt={bar:At,bubble:Lt,doughnut:zt,horizontalBar:Et,line:qt,polarArea:$t,pie:Xt,radar:Jt,scatter:qt};function te(t,e){return t.native?{x:t.x,y:t.y}:B.getRelativePosition(t,e)}function ee(t,e){var n,i,a,r,o,s,l=t._getSortedVisibleDatasetMetas();for(i=0,r=l.length;i<r;++i)for(a=0,o=(n=l[i].data).length;a<o;++a)(s=n[a])._view.skip||e(s)}function ne(t,e){var n=[];return ee(t,(function(t){t.inRange(e.x,e.y)&&n.push(t)})),n}function ie(t,e,n,i){var a=Number.POSITIVE_INFINITY,r=[];return ee(t,(function(t){if(!n||t.inRange(e.x,e.y)){var o=t.getCenterPoint(),s=i(e,o);s<a?(r=[t],a=s):s===a&&r.push(t)}})),r}function ae(t){var e=-1!==t.indexOf("x"),n=-1!==t.indexOf("y");return function(t,i){var a=e?Math.abs(t.x-i.x):0,r=n?Math.abs(t.y-i.y):0;return Math.sqrt(Math.pow(a,2)+Math.pow(r,2))}}function re(t,e,n){var i=te(e,t);n.axis=n.axis||"x";var a=ae(n.axis),r=n.intersect?ne(t,i):ie(t,i,!1,a),o=[];return r.length?(t._getSortedVisibleDatasetMetas().forEach((function(t){var e=t.data[r[0]._index];e&&!e._view.skip&&o.push(e)})),o):[]}var oe={modes:{single:function(t,e){var n=te(e,t),i=[];return ee(t,(function(t){if(t.inRange(n.x,n.y))return i.push(t),i})),i.slice(0,1)},label:re,index:re,dataset:function(t,e,n){var i=te(e,t);n.axis=n.axis||"xy";var a=ae(n.axis),r=n.intersect?ne(t,i):ie(t,i,!1,a);return r.length>0&&(r=t.getDatasetMeta(r[0]._datasetIndex).data),r},"x-axis":function(t,e){return re(t,e,{intersect:!1})},point:function(t,e){return ne(t,te(e,t))},nearest:function(t,e,n){var i=te(e,t);n.axis=n.axis||"xy";var a=ae(n.axis);return ie(t,i,n.intersect,a)},x:function(t,e,n){var i=te(e,t),a=[],r=!1;return ee(t,(function(t){t.inXRange(i.x)&&a.push(t),t.inRange(i.x,i.y)&&(r=!0)})),n.intersect&&!r&&(a=[]),a},y:function(t,e,n){var i=te(e,t),a=[],r=!1;return ee(t,(function(t){t.inYRange(i.y)&&a.push(t),t.inRange(i.x,i.y)&&(r=!0)})),n.intersect&&!r&&(a=[]),a}}},se=B.extend;function le(t,e){return B.where(t,(function(t){return t.pos===e}))}function ue(t,e){return t.sort((function(t,n){var i=e?n:t,a=e?t:n;return i.weight===a.weight?i.index-a.index:i.weight-a.weight}))}function de(t,e,n,i){return Math.max(t[n],e[n])+Math.max(t[i],e[i])}function he(t,e,n){var i,a,r=n.box,o=t.maxPadding;if(n.size&&(t[n.pos]-=n.size),n.size=n.horizontal?r.height:r.width,t[n.pos]+=n.size,r.getPadding){var s=r.getPadding();o.top=Math.max(o.top,s.top),o.left=Math.max(o.left,s.left),o.bottom=Math.max(o.bottom,s.bottom),o.right=Math.max(o.right,s.right)}if(i=e.outerWidth-de(o,t,"left","right"),a=e.outerHeight-de(o,t,"top","bottom"),i!==t.w||a!==t.h){t.w=i,t.h=a;var l=n.horizontal?[i,t.w]:[a,t.h];return!(l[0]===l[1]||isNaN(l[0])&&isNaN(l[1]))}}function ce(t,e){var n=e.maxPadding;function i(t){var i={left:0,top:0,right:0,bottom:0};return t.forEach((function(t){i[t]=Math.max(e[t],n[t])})),i}return i(t?["left","right"]:["top","bottom"])}function fe(t,e,n){var i,a,r,o,s,l,u=[];for(i=0,a=t.length;i<a;++i)(o=(r=t[i]).box).update(r.width||e.w,r.height||e.h,ce(r.horizontal,e)),he(e,n,r)&&(l=!0,u.length&&(s=!0)),o.fullWidth||u.push(r);return s&&fe(u,e,n)||l}function ge(t,e,n){var i,a,r,o,s=n.padding,l=e.x,u=e.y;for(i=0,a=t.length;i<a;++i)o=(r=t[i]).box,r.horizontal?(o.left=o.fullWidth?s.left:e.left,o.right=o.fullWidth?n.outerWidth-s.right:e.left+e.w,o.top=u,o.bottom=u+o.height,o.width=o.right-o.left,u=o.bottom):(o.left=l,o.right=l+o.width,o.top=e.top,o.bottom=e.top+e.h,o.height=o.bottom-o.top,l=o.right);e.x=l,e.y=u}Y._set("global",{layout:{padding:{top:0,right:0,bottom:0,left:0}}});var me,pe={defaults:{},addBox:function(t,e){t.boxes||(t.boxes=[]),e.fullWidth=e.fullWidth||!1,e.position=e.position||"top",e.weight=e.weight||0,e._layers=e._layers||function(){return[{z:0,draw:function(){e.draw.apply(e,arguments)}}]},t.boxes.push(e)},removeBox:function(t,e){var n=t.boxes?t.boxes.indexOf(e):-1;-1!==n&&t.boxes.splice(n,1)},configure:function(t,e,n){for(var i,a=["fullWidth","position","weight"],r=a.length,o=0;o<r;++o)i=a[o],n.hasOwnProperty(i)&&(e[i]=n[i])},update:function(t,e,n){if(t){var i=t.options.layout||{},a=B.options.toPadding(i.padding),r=e-a.width,o=n-a.height,s=function(t){var e=function(t){var e,n,i,a=[];for(e=0,n=(t||[]).length;e<n;++e)i=t[e],a.push({index:e,box:i,pos:i.posi