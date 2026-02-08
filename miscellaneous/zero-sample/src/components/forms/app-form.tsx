import {
	createFormHook,
	createFormHookContexts,
} from "@tanstack/react-form";
import * as React from "react";

type SelectOption = {
	label: string;
	value: string;
};

function TextInputField(props: {
	label: string;
	type?: React.HTMLInputTypeAttribute;
	placeholder?: string;
	min?: number;
	max?: number;
	required?: boolean;
	className: string;
}) {
	const field = useFieldContext<string | number | null | undefined>();

	return (
		<label className="block">
			<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
				{props.label}
			</div>
			<input
				type={props.type}
				placeholder={props.placeholder}
				min={props.min}
				max={props.max}
				required={props.required}
				className={props.className}
				value={field.state.value ?? ""}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
		</label>
	);
}

function SelectField(props: {
	label: string;
	options: Array<SelectOption>;
	className: string;
}) {
	const field = useFieldContext<string>();

	return (
		<label className="block">
			<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
				{props.label}
			</div>
			<select
				className={props.className}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			>
				{props.options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</label>
	);
}

function TextareaField(props: { label: string; rows?: number; className: string }) {
	const field = useFieldContext<string>();

	return (
		<label className="block">
			<div className="text-xs font-medium text-gray-700 dark:text-gray-200">
				{props.label}
			</div>
			<textarea
				rows={props.rows}
				className={props.className}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
		</label>
	);
}

function CheckboxField(props: { label: string; className?: string }) {
	const field = useFieldContext<boolean>();

	return (
		<label className={props.className ?? "flex items-center gap-2 text-sm"}>
			<input
				type="checkbox"
				checked={Boolean(field.state.value)}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.checked)}
			/>
			{props.label}
		</label>
	);
}

function SubmitButton(props: {
	idleLabel: string;
	submittingLabel: string;
	className: string;
	disabled?: boolean;
}) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<button
					type="submit"
					disabled={props.disabled || isSubmitting}
					className={props.className}
				>
					{isSubmitting ? props.submittingLabel : props.idleLabel}
				</button>
			)}
		</form.Subscribe>
	);
}

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextInputField,
		SelectField,
		TextareaField,
		CheckboxField,
	},
	formComponents: {
		SubmitButton,
	},
});
