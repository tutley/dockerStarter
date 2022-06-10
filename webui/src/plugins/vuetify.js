import Vue from 'vue';
import Vuetify, {
    VRow,
    VCol,
    VTextField,
    VTooltip,
    VRadio,
    VRadioGroup,
    VCheckbox,
    VCard,
    VCardTitle,
    VCardText,
    VCardSubtitle,
    VSelect,
    VForm,
    VSwitch,
    VExpansionPanels,
    VExpansionPanelContent,
    VExpansionPanelHeader,
} from 'vuetify/lib';
import { Ripple, Intersect, Touch, Resize, ClickOutside } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
    components: {
        VForm,
        VRow, 
        VTooltip, 
        VCol, 
        VTextField, 
        VCheckbox, 
        VSelect, 
        VRadio, 
        VRadioGroup,
        VCard,
        VCardTitle,
        VCardText,
        VCardSubtitle,
        VSwitch,
        VExpansionPanels,
        VExpansionPanelContent,
        VExpansionPanelHeader,
     },
    directives: { Ripple, Intersect, Touch, Resize, ClickOutside },
});

export default new Vuetify({
    theme: {
        themes: {
            light: {
              primary: '#ff5722',
              secondary: '#ff9800',
              accent: '#03a9f4',
              error: '#f44336',
              warning: '#ffeb3b',
              info: '#607d8b',
              success: '#8bc34a'
            }
        }
    }
});
