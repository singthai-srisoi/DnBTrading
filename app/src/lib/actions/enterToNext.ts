import type { Action } from 'svelte/action';

/** Move through visible inputs with Enter; restore focus after a successful form reset. */
export const enterToNext: Action<HTMLFormElement, boolean | undefined> = (form, enabled = true) => {
	function controls() {
		return Array.from(
			form.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button')
		).filter((element) => {
			const isInput = element instanceof HTMLInputElement;
			return (
				element.form === form &&
				(isInput
					? !['hidden', 'button', 'reset', 'image'].includes(element.type)
					: element.type === 'submit' || element.hasAttribute('data-enter-combobox')) &&
				!element.matches(':disabled') &&
				!element.closest('[inert]') &&
				element.tabIndex >= 0 &&
				element.checkVisibility({ visibilityProperty: true })
			);
		});
	}

	function focusNext(current: EventTarget | null) {
		const elements = controls();
		const index = elements.findIndex((element) => element === current);
		if (index < 0) return;
		const next = elements[index + 1];
		next?.focus();
		if (next?.hasAttribute('data-enter-combobox')) next.click();
	}

	function onAdvance(event: Event) {
		if (enabled) focusNext(event.target);
	}

	function onKeydown(event: KeyboardEvent) {
		if (
			!enabled ||
			event.defaultPrevented ||
			event.key !== 'Enter' ||
			event.isComposing ||
			event.keyCode === 229 ||
			event.shiftKey ||
			event.ctrlKey ||
			event.altKey ||
			event.metaKey
		)
			return;

		const elements = controls();
		const index = elements.findIndex((element) => element === event.target);
		if (index < 0) return;
		if (event.repeat) {
			event.preventDefault();
			return;
		}
		// Preserve native submission and validation when Enter is pressed on Submit.
		if (elements[index].type === 'submit' || elements[index].hasAttribute('data-enter-combobox'))
			return;
		event.preventDefault();
		focusNext(event.target);
	}

	function onReset(event: Event) {
		queueMicrotask(() => {
			if (!enabled || event.defaultPrevented || !form.isConnected) return;
			controls()
				.find((element) => element instanceof HTMLInputElement && element.type !== 'submit')
				?.focus();
		});
	}

	form.addEventListener('keydown', onKeydown);
	form.addEventListener('reset', onReset);
	form.addEventListener('enter-to-next', onAdvance);
	return {
		update(value = true) {
			enabled = value;
		},
		destroy() {
			form.removeEventListener('keydown', onKeydown);
			form.removeEventListener('reset', onReset);
			form.removeEventListener('enter-to-next', onAdvance);
		}
	};
};
