import {
	createFormHook,
	createFormHookContexts,
} from "@tanstack/react-form";
import * as React from "react";
import { TextField, TextArea, Select, Checkbox, Button, FormControl } from "reshaped";

type SelectOption = {
	label: string;
	value: string;
};

function TextInputField(props: {
	label: string;
	type?: React.HTMLInputTypeAttribute;
	placeholder?: string;
}) {
	const field = useFieldContext<string | number | null | undefined>();

	return (
		<FormControl>
			<FormControl.Label>{props.label}</FormControl.Label>
			<TextField
				name={field.name}
				inputAttributes={{ type: props.type }}
				placeholder={props.placeholder}
				value={String(field.state.value ?? "")}
				onBlur={field.handleBlur}
				onChange={({ value }) => field.handleChange(value)}
			/>
		</FormControl>
	);
}

function SelectField(props: {
	label: string;
	options: Array<SelectOption>;
}) {
	const field = useFieldContext<string>();

	return (
		<FormControl>
			<FormControl.Label>{props.label}</FormControl.Label>
			<Select
				name={field.name}
				value={field.state.value}
				onChange={({ value }) => field.handleChange(value)}
			>
				{props.options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
		</FormControl>
	);
}

function TextareaField(props: { label: string; rows?: number }) {
	const field = useFieldContext<string>();

	return (
		<FormControl>
			<FormControl.Label>{props.label}</FormControl.Label>
			<TextArea
				name={field.name}
				inputAttributes={{ rows: props.rows }}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={({ value }) => field.handleChange(value)}
			/>
		</FormControl>
	);
}

function CheckboxField(props: { label: string }) {
	const field = useFieldContext<boolean>();

	return (
		<Checkbox
			name={field.name}
			checked={Boolean(field.state.value)}
			onChange={({ checked }) => field.handleChange(checked)}
		>
			{props.label}
		</Checkbox>
	);
}

function SubmitButton(props: {
	idleLabel: string;
	submittingLabel: string;
	disabled?: boolean;
}) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="submit"
					disabled={props.disabled || isSubmitting}
					color="primary"
				>
					{isSubmitting ? props.submittingLabel : props.idleLabel}
				</Button>
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
