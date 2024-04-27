/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group flex-wrap'
		},
		button: {
			className: 'btn btn-secondary'
		},
		collection: {
			tag: 'div',
			className: 'dropdown-menu',
			closeButton: false,
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'active',
				disabled: 'disabled'
			}
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper btn-group',
			closeButton: false,
		},
		splitDropdown: {
			tag: 'button',
			text: '',
			className: 'btn btn-secondary dt-btn-split-drop dropdown-toggle dropdown-toggle-split',
			closeButton: false,
			align: 'split-left',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button btn btn-secondary',
			closeButton: false
		} 
	},
	buttonCreated: function ( config, button ) {
		return config.buttons ?
			$('<div class="btn-group"/>').append(button) :
			button;
	}
} );

DataTable.ext.buttons.collection.className += ' dropdown-toggle';
DataTable.ext.buttons.collection.rightAlignClassName = 'dropdown-menu-right';

return DataTable.Buttons;
}));
       _^[��]� �w@�E�w8�w4P�3  ���؃> �E�    ujh�   hh��h ���.nA ���ShMwds�p��)7���M�E�������t!�A�E�U��������E�EHu�j��w`�E�wX�wTP�2  ���؃> �E�   ujh�   hh��h ���mA ���ShMlgh�p��6���M�E�������t!�A�E�U��������E�EHu�j��> ujh�   hh��h ���RmA ������p�Gh��$hCclB�%���> ujh�   hh��h ���mA ������p�Gp��$hCthW��$���> ujh�   hh��h ����lA ����p���   �hrtnC�.���G���̉�G�A��� ����u/�> uPh�   hh��h ���lA ����p���   hhgrB�.�> ujh�   hh��h ���YlA ����p���   hCrlC��.���M�_^d�    [��]� ������������U��d�    j�h���Pd�%    ��`VW���M�����jhX�h�nj �u�qt h������W@���M����E�P����  ��X1   t}�G0P��x1  �  ��tj��X1   t��\1  P��\1  �mb4 ��uK�u�> ujh�   hh��h ���kkA ����p��\1  �PhgnsU�@��_^�M�d�    ��]� �O4�uS;M�u�G8;E�u�G@;E�t{�w@�E�w8QP��/  ���؃> �E�    ujh�   hh��h ����jA ���ShMwds�p���3���M�E�������t!�A�E�U��������E�EHu�j��OT;M�u�GX;E�u�G`;E�t{�w`�E�wXQP�//  ���؃> �E�   ujh�   hh��h ���XjA ���ShMlgh�p��S3���M�E�������t!�A�E�U��������E�EHu�j��Ghf.E�[���D{<�> ujh�   hh��h ����iA ������p�Gh��$hCclB�!���Gpf.Eԟ��D{<�> ujh�   hh��h ���iA ������p�Gp��$hCthW�[!�����   ;E�t5�> ujh�   hh��h ���UiA ����p���   �hrtnC�+�����   ;E�t5�> ujh�   hh��h ���iA ����p���   �hCrlC��*�����   ;E�t5�> ujh�   hh��h ����hA ����p���   �hhgrB�*���M�_^d�    ��]� ���������h����=�������U���ESVW�����$�  �������\E�u�Ϙ��$�D.  �]�M��E    ���
  �J;ЉE�E�UMȍE�9 O��M� ��u��
  �J;ЉE�U�EM��E    _^�9 O�� �[]� ���������U��A0�MP�����]� ������������̸9  f�A���������
  W��   ��~ V�������    �G    �������^_�������������j`���s ����t	��������3�j`�(�;���s ����t��������,�;��,�;    �������������U��QSV��W��  ��   ����   ����   ��  ��   �Gt �Z��Ӌ��E��5t �M��   �Z����^��f;�
  }Q��  �S��t ��  ��   �Z��E���t �M����Z��^��XL����G��
  ;�|�_^[��]��������������U���M3��\M�EfT���f/���]�����������̊��   ����������U���M�Yз�V����3�W�}�YM�^��U�I fn�����\Mf(��Y��Y�fW���	t �Y����U�X����,��>F��   |�_^]� ���������������U��j�h���d�    Pd�%    ���  SVW�����ċW�w��p蘦 �����	�E�u	�E�   �$f��f��jh  hh��h ���eA ���UW��]SfE��B�J+B+
��ẺU���1 �u���������f;�u�A�}W��k�|���   �E��ΉE�M��E��E�f;�u�@�E�S�P�1 ���֋����f;�u�Q�Eċ}蘃�k�|�P������P��k�|����3}A �MP�E�P�&}A �E��};E��G  �E�;E��;  V�E�PS������J�2 V�E��E�    PW��X�����2 �E��E�f���z  �E�PS��1 ����@���P�8h2 �E��E�P��@����Uo2 ���;  �E�PW�������h2 �E��E�P�������*o2 ����   �E����E�s,C �����uȍE��u�P�E�P��� ���E�PS��1 ����d���P�O�0 j �E��E�PW�����虢0 �E�+Eԋ�4����]��E�E�+EЉE �����P�E����0 ����d���P��0 �M�MWSQ�u VP������ �S� ������E���0 ��d����E�蕥0 �E�P�������Fn2 �]�}��� ����������E��j2 �E�P��@����n2 ���������@����]  f���
  �E�PS�#�1 ��������P�f2 �E��E�P��������m2 ����  �E�PW�������f2 �E��E�P�������m2 ���z  ��*C �D����uȍE��u�P�E�P�q� ���EЍ�d���PS�ޢ0 �E��E�P�CP��`����Ǣ0 �E��E�	P�CP������谢0 j �E��E�
PW��������0 ������E���f;�u�A�]ؘ+]�k�|���   �E��4����E�E��E�E�+EԉE������P�:�0 ��������P�,�0 ����`���P��0 �E���M���$Q�u��u��u�SWVP��d���P��0 ��P�  ��,�`� ������E�
�!�0 �������E�	袣0 ��`����E�蓣0 ��d����E�脣0 �E�P�������5l2 �]�u�}��������������E��h2 �E�P�������l2 ���5����������I  f���H  �E�PS��1 ��������P�d2 �E��E�P�������k2 ���  ��I �E�PW�������pd2 �E��E�P�������k2 ����  ��I ��(C �&����uȍE��u�P�E�P�S� ���EЍ�d���PS���0 �E��E�P�CP��(���詠0 �E��E�P�CP������蒠0 �E��E�P�CP��`����{�0 j �E��E�PW�������Ş0 ������E���f;�u�A�k�|���   �E�������E �E��E�E�+EԉE�E�+EЉE�������P��0 �؍�`���P���0 ��������P��0 ����(���P�ا0 �M����Q�u �u��u��u�SWVP��d���P貧0 ��P��   ��(�!� �������E���0 ��`����E��c�0 �������E��T�0 ��(����E��E�0 ��d����E��6�0 �E�P��������i2 �]�u�}���V����������E��Gf2 �E�P�������i2 ��� ����������E��!f2 ��X����E� ���2 ������E������`�2 �M�_^d�    [��]� �������������U��E,��u%�u(�u$�u �u�u�u�u�u�u�E�����$]Ã�u%�u(�u$�u �u�u�u�u�u�u�K�����$]�jhS  hh��h���`]A ��]������������U��E(��u0�E,���$�u$�u �u�u�u�u�u�u�p����(]Ã�u0�E,���$�u$�u �u�u�u�u�u�u�t����(]�jh(  hh��h����\A ��]������U����
  3���~#�M�	��$    ����Z�f/�v@;�|�]� ���������U��j�h㒽d�    Pd�%    ��VWh�1  �E�    ���s �Ѓ��U��E�    ��t$�u�E�����u��E�u�A���������3����E�   �K����u���E�    �>�A �M�� ����M��_d�    ^��]���������������U��j�h��d�    Pd�%    ��V��u쀾�    �<  SW�u�X�1 ���M� �E�؏ �E�M�j ���E�    P�EP��2 �E�E�P�E�P�kE1 ���0���   �E��������M��E��Ip���EP�E�P�<E1 ���0���   �E����v����M��E��p���EP�E�P�E1 ���0���   �E��I����M��E���o�����   j �Pz1 �j �Gz1 �j �>z1 ���   �����P����.1 �3�����P���.1 �7�����P���.1 �E�M��E� ƀ�   �W�2 �M�E������xo��_[�M�^d�    ��]� �����U��QS�]4�M���t!��tjh�
  hh��h ���%ZA �M����u8�S�]0S�u,�u(�u �u�u�u�u�u�Pl�u8�M��u4S�u,��u(�u$�uj�Ph[��]�4 ������U��j�hg��d�    Pd�%    ��  V��W�u��P`�} ��t2��t#jh   hh��h ���YA W����E���H��������E�fnF4�������^����[�s ����f/������U�r�^��E���U�fnFT�������^�����s f(�����f/�r�^��M�������E���u��   �E싆  ���  �E싆  �E����   �E܋��   �EЃ�u��  ���  �N���V�E�ĉ�P蹙 ����u.fn��   ����з��^���fW���R�s �E����   P�������ѽ�����   P������追����u�����������������������N���V�ĉ�P�/� ����tf�Ef��w���3��������    �}���  ���   �0�E������P���+1 �E��   �E�0����P���+1 �M�u$��ΉM������M�f;�u�@��E��M��֋	f;u�u�Q�}���k�|�7���P�E�P��k�|��MP������P��oA ����oA �E��}��u$;E��"  �E�;E��  V�E�P�u���t�����2 V�E��E�    P�u��h����x�2 �u�E�PW��E���X���fnVx���   ���P�E��^����YU��U�fnV|����^����YU��U���Z2 �E��E�P��X�����a2 ���C  ���E�P���   P��8����:�0 �E��E�P���   P������ �0 ��������\����E��E�D$W��D$�Fh�$��������t4�������D$W��D$�Fp�$�j�������t2����~4 u
�~T ��   ����   �Eԃ� �E�+E��D$�E��D$��=�����D$��=�����$�u �u�uP�E�+E�P�u�u�  �E�+E��u�+u��E$�����P��0 �E���8�M�$�u��E��u��uЃ��$�u��E��u܃��$�u Q�uQ�u$V�uVP��8���P輝0 ��PV�v�E�+E��u�+u��E$�����P蚝0 �E�Q�$�u��E��u��uЃ��$�u��E��u܃��$�u �u�u�u�u$V�uP��8���P�F�0 ��P�u�J�����T�E��������0 ��8����E����0 �E�P��X����_2 �u���������X����E��\2 ��h����E� ���2 ��t����E�������2 �M�_d�    ^��]�  �������������U���S�] V�u,�M��C+�E��C+C�E ��t!��tjh�
  hh��h ���~SA �M����u0�V�u(�u$VS�]S�uj �Ph�E���fn��   ����^����$�u,�u(V�u �u��u�uS�u�u�u�  ��4^[��]�, ��U��j�h�d�    Pd�%    ���  VW���}��P`�u,��t-��tjh�	  hh��h ����RA ��W���H��������E�fnG4�������^�����s ����f/�r�^�������E�fnGT�������^����a�s f(�����f/�r�^��M�������E�fn��   ����^����E���u��   �E���  ���  �E���  �E싇�   �E؋��   �E܃�u��  ���  �E荍�������   P�R������   P�������@�����u�������P����������E������    �U  ���   ����P���u%1 ���   ���   �E��q���P���Y%1 �M��u0��ΉM������M�f;�u�@��E����   ��f;u�u�Q�u����k�|�>���P�E�P��k�|��M P��|���P�iA ���iA �E��}�u0;E���  �E�;E���  V�E�P���   P��L����H�2 V�E��E�    P���   V��X����*�2 fnWx�E����P�E����   ������PW��^����E��YU���d����U�fnW|����^����YU��U��zT2 ��d����E�P�������[2 ����  ��d���PV��L����IT2 �E��E�P��L����f[2 ���b  �E�P���   P�����踐0 �E��E�PV������褐0 ��������@����E��E0�D$W��D$�Gh�$��������t4�������D$W��D$�Gp�$���������t2����4 u
�T ��   ����   �EЍ������}ă�8�u���+}�+u��D$0�E��D$(P薴����(��������P腴���u,�u(�u$WV�u�u�u�u�u�u��  �}č������u�+}�+u�P苗0 �E��Ĉ   �M(�$�u��E��u��u܃��$�u��E��u؃��$�u,Q�u0QW�}V�uVW�uP�����P�-�0 ��PVW�u�}�}č������u�+}�+u�P�
�0 �E�Q�$�u��E��u��u܃��$�u��E��u؃��$�u,�u(�u0�u$WV�u�u�uP�����P貖0 ��P�u�u�u蠺����d�E��������n�0 ������E��_�0 �E�P��L����Y2 �}䍷�   ��������u���L����E��mU2 ��d���P��������X2 ���G����������E��DU2 ��X����E� ��2 ��L����E��������2 �M�_d�    ^��]�, �U��V��W�}�F\:G\�  �F;G�  �F;G��   �F;G��   �F;G��   �F;G��   �F;G��   �F;G��   �F ;G ��   �:��   �G$P�N$褵������   �F4;G4��   �������D$�G8�D$�F8�$���������tR�������D$�G@�D$�F@�$��������t �FT;GTu�FP;GPu�FX;GXu_�^]� _2�^]� ����U��j�hГ�d�    Pd�%    ��dSVW��e��M��E�    �.���jhX�h�nj �u��s ���M�Q�������E�P�N0�n����M�d�    _^[��]� ��EËM�2�_^d�    [��]� U��d�    j�h���Pd�%    ��   VW����h���裰���} u��h�����P�����u�> ujh�   hh��h ����JA ���hgnsU�@    ����������   �M���?4 �> �E�    ujh�   hh��h ���JA ����@    �EȋPhgnsU諦����f����   ��h����E���S�E��E���4 Pj�h���M�j4 �E�E�P�E�Ph��E�E�Phihhs�6�	 ���E��M���5n4 ��[t(��h���ƇX1  P��x1  �����E�P��\1  �h@4 �E����M��E�������?4 �> ujh�   hh��h ���IA ���hMwds�@    �������t#��x���P��p���P��l���PhMwdsV��  ���> ujh�   hh��h ���]IA ���hMlgh�@    ��e�����t�E�P�E�P�E�PhMlghV�  ���> ujh�   hh��h ���IA ���hCclB�@    �������tC�> ujh�   hh��h ����HA ����@    �E�PhCclB�ɱ���E����E��> ujh�   hh��h ���HA ���hCthW�@    �������tC�> ujh�   hh��h ���[HA ����@    �E�PhCthW�O����E����E��> ujh�   hh��h ���HA ���hrtnC�@    �� �����t7�> ujh�   hh��h ����GA ����@    �E��PhrtnC赶���> ujh�   hh��h ���GA ���hCrlC�@    �������t7�> ujh�   hh��h ���sGA ����@    �E��PhCrlC�G����> ujh�   hh��h ���<GA ���hhgrB�@    ��D�����t7�> ujh�   hh��h ���GA ����@    �E��PhhgrB�ٵ��jj ��h�����P��
  �M��_^d�    ��]� ���U��QSV�u��W���� �ΉE�U��0# ����|��
~h&����OA ����� �ΈC\�u �ΉC�k �ΉC�a �ΉC�W �ΉC�M �ΉC$�C �ΉC,�9 �ΉC(�/ �ΉC0�E �[8���; ���[@� �ΉCP� �ΉCT�� j �ΉCX�1 +EU�RP�Ի�����΍P���+ЋRP�6 _^[��]� ����U����=(�; ujh(  hh��h ���EA ��V�u�> ujh�   hh��h ���yEA ���hdtxE�@    �������tI�> ujh�   hh��h ���BEA ����@    �(�;���\PhdtxE�Q����(�;�@\� �;�> ujh�   hh��h ����DA ���hMwds�@    �������t �(�;�AP�AP�APhMwdsV�0  ���> ujh�   hh��h ���DA ���hMlgh�@    �������t �(�;�A0P�A(P�A$PhMlghV��  ���> ujh�   hh��h ���KDA ���hCclB�@    ��S�����tH�> ujh�   hh��h ���DA ����@    �E��PhCclB�����(�;���E��@8�> ujh�   hh��h ����CA ���hCthW�@    ��������tH�> ujh�   hh��h ���CA ����@    �E��PhCthW艬���(�;���E��@@�> ujh�   hh��h ���MCA ���hrtnC�@    ��U�����t<�> ujh�   hh��h ���CA ����@    �(�;���PPhrtnC�����> ujh�   hh��h ����BA ���hCrlC�@    ��������t<�> ujh�   hh��h ���BA ����@    �(�;���TPhCrlC�r����> ujh�   hh��h ���gBA ���hhgrB�@    ��o�����t<�> ujh�   hh��h ���0BA ����@    �(�;���XPhhgrB������,�;��ujhc  hh��h ����AA �,�;���5(�;������> ujh�   hh��h ����AA ���j hPcdA�@    ��֟���l�^��]� ����������U��d�    j�hȹ�Pd�%    ��V�u�> ujh�   hh��h ���VAA ���j j �u�@    �E�P�H����E�E�    ^��ujh�   hh��h ���AA �E���Mj �H�Mh�=��(����]��E��Y����E�^����X����,ȉ�E��ujh�   hh��h ���@A �E���Mj �H�Mh����ǩ���]��E��Y����E�^����X����,ȉ�E��ujh�   hh��h ���Q@A �E���u�M�H�Mhă��E����M�E�������t!�A�E�U��������E�EHu�j��M�d�    ��]��������̡,�;V���ujh�  hh��h ����?A �,�;��jj P���  ^� ������U��d�    �M�j�hh��Pd�%    �� SVW�}W覚���]�U�3��F�k�|��0�   �B�k�|���   f;�u.�u �E��u�uPW�u�uS���/ �� _^[�M�d�    ��]��F�k�|��0�   u�B�k�|���   tjh�  hh��h ����>A ���ESP�Rw �u �E��E�    �u�uPW�u�E�uP�n�/ ��(�E������M�S���M�_^[d�    ��]������������U��E0��u6�E4���$�u,�u(�u$�u �u�u�u�u�u�u������0]Ã�u6�E4���$�u,�u(�u$�u �u�u�u�u�u�u������0]�jh�  hh��h����=A ��]���������̡(�;V���ujh	  hh��h ����=A �(�;��P�������^�������������U��E ��uK�E<�� �D$�E4�D$�E,�D$�E$�$�u�u�u�u�u�u������8]Ã�uK�E<�� �D$�E4�D$�E,�D$�E$�$�u�u�u�u�u�u������8]�jh�  hh��h����<A ��]����������������U��E0��uO���   �E\���D$���   �$P�E4P�u,�u(�u$�u �u�u�u�u�u�u������@]Ã�uO���   �E\���D$���   �$P�E4P�u,�u(�u$�u �u�u�u�u�u�u������@]�jh}  hh��h���<A ��]��������U��SV��W�}�ύ^0S�������uY�G8f.C8���Dz �G@f.C@���Dz�G;Cu�G0;C0t��  ǆ�   �f���   W���ȸ�����F�ݽ��_^[]� ������U���E��E�A�E�A]� �������������l����������U��j�h���d�    Pd�%    QV�E�    �uh���V�E�    �:������> �E�    �E�   ujh�   hh��h ����:A ��fnE��[���pZ���Y����^����$hcrP#h�=��R���> ujh�   hh��h ���:A ��fnE��[���pZ���Y����^����$hcrP#h��������> ujh�   hh��h ���@:A ����uhă��q��y����M��^d�    ��]���������U����
  Jxt�M�B��|H�A����@Z�f/�vS�@Z�f/�v`� Z�f/�vI�@�Z�f/�v1������}���x���$    ���Z�f/�vJy�B]� ���B]� ���B]� J�B]� �����������̡(�;V���ujh�  hh��h ���>9A �(�;��jj P������^� ������U��j�hZ��d�    Pd�%    ��X  V�uW�W�}�E����F+F�N+��fE��E���l�����E��E�U��E���f;Eu�Q��k�|���P�E�P�}QA �M�u�	�6�A���V�k�|��NP��,���P��k�|��JQA P�����P�M��:QA �ofo��M�fs�fs�f~�f~�;��i  �E�;E��]  �u�E�VPW�M��Ƹ2 �E��E�    PW�������_<2 �E��E�P�������|C2 ����  �d$ �E�P�u�������.<2 ��l����E�P�������HC2 ����  ��l���P�u��<�����;2 �E��E�P��<����C2 ���I  �k C 趹���u܍E��u�P�E�P�� ���E���<���PW�Px0 j �E��E�P�u�������v0 j �E��E�P�u�������v0 ��E���f;uu�A��}�k�|+}����   �E䋅�����E؋������E싅`����E�E�+EĉE�������P�0 ��������P�0 �M�����u Q�u��u��u��u�WVP��<���P�0 ��P��   ��(�� �������E��z0 ��

			tableSizes.height = offsetParent.outerHeight();
			tableSizes.width = offsetParent.width() + parseFloat(computed.paddingLeft);
			tableSizes.right = tableSizes.left + tableSizes.width;
			tableSizes.bottom = tableSizes.top + tableSizes.height;

			// Set the initial position so we can read height / width
			var top = buttonPosition.top + hostNode.outerHeight();
			var left = buttonPosition.left;

			display.css( {
				top: top,
				left: left
			} );

			// Get the popover position
			computed = window.getComputedStyle(display[0]);
			var popoverSizes = display.offset();

			popoverSizes.height = display.outerHeight();
			popoverSizes.width = display.outerWidth();
			popoverSizes.right = popoverSizes.left + popoverSizes.width;
			popoverSizes.bottom = popoverSizes.top + popoverSizes.height;
			popoverSizes.marginTop = parseFloat(computed.marginTop);
			popoverSizes.marginBottom = parseFloat(computed.marginBottom);

			// First position per the class requirements - pop up and right align
			if (options.dropup) {
				top = buttonPosition.top - popoverSizes.height - popoverSizes.marginTop - popoverSizes.marginBottom;
			}

			if (options.align === 'button-right' || display.hasClass( options.rightAlignClassName )) {
				left = buttonPosition.left - popoverSizes.width + hostNode.outerWidth(); 
			}

			// Container alignment - make sure it doesn't overflow the table container
			if (options.align === 'dt-container' || options.align === 'container') {
				if (left < buttonPosition.left) {
					left = -buttonPosition.left;
				}

				if (left + popoverSizes.width > tableSizes.width) {
					left = tableSizes.width - popoverSizes.width;
				}
			}

			// Window adjustment
			if (containerPosition.left + left + popoverSizes.width > $(window).width()) {
				// Overflowing the document to the right
				left = $(window).width() - popoverSizes.width - containerPosition.left;
			}

			if (buttonOffset.left + left < 0) {
				// Off to the left of the document
				left = -buttonOffset.left;
			}

			if (containerPosition.top + top + popoverSizes.height > $(window).height() + $(window).scrollTop()) {
				// Pop up if otherwise we'd need the user to scroll down
				top = buttonPosition.top - popoverSizes.height - popoverSizes.marginTop - popoverSizes.marginBottom;
			}

			if (containerPosition.top + top < $(window).scrollTop()) {
				// Correction for when the top is beyond the top of the page
				top = buttonPosition.top + hostNode.outerHeight();
			}

			// Calculations all done - now set it
			display.css( {
				top: top,
				left: left
			} );
		}
		else {
			// Fix position - centre on screen
			var position = function () {
				var half = $(window).height() / 2;

				var top = display.height() / 2;
				if ( top > half ) {
					top = half;
				}

				display.css( 'marginTop', top*-1 );
			};

			position();

			$(window).on('resize.dtb-collection', function () {
				position();
			});
		}

		if ( options.background ) {
			Buttons.background(
				true,
				options.backgroundClassName,
				options.fade,
				options.backgroundHost || hostNode
			);
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

		if ( options.autoClose ) {
			setTimeout( function () {
				dt.on( 'buttons-action.b-internal', function (e, btn, dt, node) {
					if ( node[0] === hostNode[0] ) {
						return;
					}
					close();
				} );
			}, 0);
		}
		
		$(display).trigger('buttons-popover.dt');


		dt.on('destroy', close);

		setTimeout(function() {
			closed = false;
			$('body')
				.on( 'click.dtb-collection', function (e) {
					if (closed) {
						return;
					}

					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';
					var parent = $(e.target).parent()[0];
	
					if (( ! $(e.target).parents()[back]().filter( content ).length  && !$(parent).hasClass('dt-buttons')) || $(e.target).hasClass('dt-button-background')) {
						close();
					}
				} )
				.on( 'keyup.dtb-collection', function (e) {
					if ( e.keyCode === 27 ) {
						close();
					}
				} );
		}, 0);
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade, insertPoint ) {
	if ( fade === undefined ) {
		fade = 400;
	}
	if ( ! insertPoint ) {
		insertPoint = document.body;
	}

	if ( show ) {
		_fadeIn(
			$('<div/>')
				.addClass( className )
				.css( 'display', 'none' )
				.insertAfter( insertPoint ),
			fade
		);
	}
	else {
		_fadeOut(
			$('div.'+className),
			fade,
			function () {
				$(this)
					.removeClass( className )
					.remove();
			}
		);
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( group === undefined || group === null ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( Array.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( input.trim(), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
		else if ( typeof input === 'object' ) {
			// Actual instance selector
			ret.push( input );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( Array.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			if (inst.s.buttons[ selector ]) {
				ret.push( {
					inst: inst,
					node: inst.s.buttons[ selector ].node
				} );
			}
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( a[i].trim(), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};

/**
 * Default function used for formatting output data.
 * @param {*} str Data to strip
 */
Buttons.stripData = function ( str, config ) {
	if ( typeof str !== 'string' ) {
		return str;
	}

	// Always remove script tags
	str = str.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );

	// Always remove comments
	str = str.replace( /<!\-\-.*?\-\->/g, '' );

	if ( ! config || config.stripHtml ) {
		str = str.replace( /<[^>]*>/g, '' );
	}

	if ( ! config || config.trim ) {
		str = str.replace( /^\s+|\s+$/g, '' );
	}

	if ( ! config || config.stripNewlines ) {
		str = str.replace( /\n/g, ' ' );
	}

	if ( ! config || config.decodeEntities ) {
		_exportTextarea.innerHTML = str;
		str = _exportTextarea.value;
	}

	return str;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: ''
		},
		button: {
			tag: 'button',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled',
			spacerClass: ''
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		},
		split: {
			tag: 'div',
			className: 'dt-button-split',
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper',
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'dt-btn-split-drop',
			align: 'split-right',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button dt-button',
		},
		splitCollection: {
			tag: 'div',
			className: 'dt-button-split-collection',
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '2.2.2';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		closeButton: false,
		init: function ( dt, button, config ) {
			button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			if ( config._collection.parents('body').length ) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}
		},
		attr: {
			'aria-haspopup': true
		}
		// Also the popover options, defined in Buttons.popover
	},
	split: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.split', 'Split' );
		},
		className: 'buttons-split',
		closeButton: false,
		init: function ( dt, button, config ) {
			return button.attr( 'aria-expanded', false );
		},
		action: function ( e, dt, button, config ) {
			this.popover(config._collection, config);
		},
		attr: {
			'aria-haspopup': true
		}
		// Also the popover options, defined in Buttons.popover
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
	},
	csv: function ( dt, conf ) {
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
	},
	excel: function ( dt, conf ) {
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
	},
	pdf: function ( dt, conf ) {
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = [];
		var lang = [];
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		// Support for DataTables 1.x 2D array
		if (Array.isArray( lengthMenu[0] )) {
			vals = lengthMenu[0];
			lang = lengthMenu[1];
		}
		else {
			for (var i=0 ; i<lengthMenu.length ; i++) {
				var option = lengthMenu[i];

				// Support for DataTables 2 object in the array
				if ($.isPlainObject(option)) {
					vals.push(option.value);
					lang.push(option.label);
				}
				else {
					vals.push(option);
					lang.push(option);
				}
			}
		}

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					className: 'button-page-length',
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( conf.text );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	},
	spacer: {
		style: 'empty',
		spacer: true,
		text: function ( dt ) {
			return dt.i18n( 'buttons.spacer', '' );
		}
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.m