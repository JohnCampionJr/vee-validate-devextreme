import { SetupContext } from 'vue';

export function normalizeChildren(context: SetupContext<any>, slotProps: any) {
  if (!context.slots.default) {
    return context.slots.default;
  }

  return context.slots.default(slotProps);
}

export function hasCheckedAttr(type: unknown) {
  return type === 'checkbox' || type === 'radio';
}

/**
 * Checks if an tag name is a native HTML tag and not a Vue component
 */
function isHTMLTag(tag: string) {
  return ['input', 'textarea', 'select'].includes(tag);
}

/**
 * Checks if an input is of type file
 */
function isFileInputNode(tag: string, attrs: Record<string, unknown>) {
  return isHTMLTag(tag) && attrs.type === 'file';
}

/**
 * Checks if an element is a native HTML5 multi-select input element
 */
export function isNativeMultiSelect(el: HTMLElement): el is HTMLSelectElement {
  return el.tagName === 'SELECT' && (el as HTMLSelectElement).multiple;
}

/**
 * Checks if a tag name with attrs object will render a native multi-select element
 */

function isNativeMultiSelectNode(tag: string, attrs: Record<string, unknown>) {
  // The falsy value array is the values that Vue won't add the `multiple` prop if it has one of these values
  const hasTruthyBindingValue =
    ![false, null, undefined, 0].includes(attrs.multiple as boolean) && !Number.isNaN(attrs.multiple);

  return tag === 'select' && 'multiple' in attrs && hasTruthyBindingValue;
}

/**
 * Checks if a node should have a `:value` binding or not
 *
 * These nodes should not have a value binding
 * For files, because they are not reactive
 * For multi-selects because the value binding will reset the value
 */
export function shouldHaveValueBinding(tag: string, attrs: Record<string, unknown>) {
  return isNativeMultiSelectNode(tag, attrs) || isFileInputNode(tag, attrs);
}
