import { h, defineComponent, toRef, SetupContext, resolveDynamicComponent, computed, watch } from 'vue';
import { getConfig, useField, fieldUtils } from 'vee-validate';
import DxTextBox from 'devextreme-vue/text-box';

const { normalizeChildren, hasCheckedAttr, shouldHaveValueBinding } = fieldUtils;

interface ValidationTriggersProps {
  validateOnMount: boolean;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnInput: boolean;
  validateOnModelUpdate: boolean;
}

export const DxField = defineComponent({
  name: 'DxField',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object],
      default: undefined,
    },
    name: {
      type: String,
      required: true,
    },
    rules: {
      type: [Object, String, Function],
      default: null,
    },
    validateOnMount: {
      type: Boolean,
      default: false,
    },
    validateOnBlur: {
      type: Boolean,
      default: undefined,
    },
    validateOnChange: {
      type: Boolean,
      default: undefined,
    },
    validateOnInput: {
      type: Boolean,
      default: undefined,
    },
    validateOnModelUpdate: {
      type: Boolean,
      default: undefined,
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails,
    },
    label: {
      type: String,
      default: undefined,
    },
    uncheckedValue: {
      type: null,
      default: undefined,
    },
    value: {
      type: null,
    },
  },
  model: { prop: 'value', event: 'update:value' },
  emits: ['update:value'],
  setup(props, ctx) {
    const rules = toRef(props, 'rules');
    const name = toRef(props, 'name');
    const label = toRef(props, 'label');
    const uncheckedValue = toRef(props, 'uncheckedValue');

    const {
      errors,
      value: fieldValue,
      errorMessage,
      validate: validateField,
      handleChange,
      handleBlur,
      handleInput,
      setDirty,
      setTouched,
      resetField,
      handleReset,
      meta,
      checked,
    } = useField(name, rules, {
      validateOnMount: props.validateOnMount,
      bails: props.bails,
      type: ctx.attrs.type as string,
      // Gets the initial value either from `value` prop/attr or `v-model` binding (modelValue)
      // For checkboxes and radio buttons it will always be the model value not the `value` attribute
      initialValue: hasCheckedAttr(ctx.attrs.type) ? props.value : 'value' in props ? props.value : ctx.attrs.value,
      // Only for checkboxes and radio buttons
      valueProp: ctx.attrs.value,
      uncheckedValue,
      label,
      validateOnValueUpdate: false,
    });

    // If there is a v-model applied on the component we need to emit the `update:modelValue` whenever the value binding changes
    const onChangeHandler =
      'value' in props
        ? function handleChangeWithModel(e: any) {
            handleChange(e);
            ctx.emit('update:value', fieldValue.value);
          }
        : handleChange;

    const onInputHandler =
      'value' in props
        ? function handleChangeWithModel(e: any) {
            handleInput(e);
            ctx.emit('update:value', fieldValue.value);
          }
        : handleInput;

    const fieldProps = computed(() => {
      const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = resolveValidationTriggers(
        props
      );

      // DX controls expect a function, not an array of functions
      const baseOnBlur = () => {
        handleBlur();
        if (ctx.attrs.onBlur) (ctx.attrs as any).onBlur();
        if (validateOnBlur) validateField();
      };
      const baseOnInput = (e: any) => {
        // check for DX Events which actually have the event as a prop
        const event = e.event ? e.event : e;
        onInputHandler(event);
        if (validateOnInput) onChangeHandler(event);
        if (ctx.attrs.onInput) (ctx.attrs as any).onInput(event);
      };
      const baseOnChange = (e: any) => {
        // check for DX Events which actually have the event as a prop
        const event = e.event ? e.event : e;
        onInputHandler(event);
        if (validateOnChange) onChangeHandler(event);
        if (ctx.attrs.onChange) (ctx.attrs as any).onChange(event);
      };

      // const baseOnBlur = [handleBlur, ctx.attrs.onBlur, validateOnBlur ? validateField : undefined].filter(Boolean);
      // const baseOnInput = [onInputHandler, validateOnInput ? onChangeHandler : undefined, ctx.attrs.onInput].filter(
      //   Boolean
      // );
      // const baseOnChange = [onInputHandler, validateOnChange ? onChangeHandler : undefined, ctx.attrs.onChange].filter(
      //   Boolean
      // );

      // DX Uses focus out rather than blur
      const attrs: Record<string, any> = {
        name: props.name,
        onBlur: baseOnBlur,
        onFocusOut: baseOnBlur,
        onInput: baseOnInput,
        onChange: baseOnChange,
      };

      if (validateOnModelUpdate) {
        attrs['onUpdate:value'] = [onChangeHandler];
      }

      if (hasCheckedAttr(ctx.attrs.type) && checked) {
        attrs.checked = checked.value;
      } else {
        attrs.value = fieldValue.value;
      }

      const tag = resolveTag(props, ctx);
      if (shouldHaveValueBinding(tag, ctx.attrs)) {
        delete attrs.value;
      }

      return attrs;
    });

    const slotProps = computed(() => {
      return {
        field: fieldProps.value,
        value: fieldValue.value,
        meta,
        errors: errors.value,
        errorMessage: errorMessage.value,
        validate: validateField,
        resetField,
        handleChange: onChangeHandler,
        handleInput: onInputHandler,
        handleReset,
        handleBlur,
        setDirty,
        setTouched,
      };
    });

    if ('value' in props) {
      const modelValue = toRef(props, 'value');
      watch(modelValue, newModelValue => {
        if (newModelValue !== fieldValue.value) {
          fieldValue.value = newModelValue;
          validateField();
        }
      });
    }

    return () => {
      const tag = resolveDynamicComponent(resolveTag(props, ctx)) as string;

      const children = normalizeChildren(ctx, slotProps.value);

      if (tag) {
        return h(
          tag,
          {
            ...ctx.attrs,
            ...fieldProps.value,
          },
          children
        );
      }

      return children;
    };
  },
});

function resolveTag(props: Record<string, any>, ctx: SetupContext<any>) {
  let tag: string = props.as || '';

  if (!props.as && !ctx.slots.default) {
    tag = DxTextBox;
  }

  return tag;
}

function resolveValidationTriggers(props: ValidationTriggersProps) {
  const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = getConfig();

  return {
    validateOnInput: props.validateOnInput ?? validateOnInput,
    validateOnChange: props.validateOnChange ?? validateOnChange,
    validateOnBlur: props.validateOnBlur ?? validateOnBlur,
    validateOnModelUpdate: props.validateOnModelUpdate ?? validateOnModelUpdate,
  };
}
