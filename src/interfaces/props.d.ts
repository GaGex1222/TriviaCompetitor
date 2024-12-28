export interface TriviaFormErrorsProps {
    errors: string[];
    onClose: () => void;
}

export interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>, arg?: string) => void | Promise<void>;
    dynamicArg?: string;
    buttonLoading: boolean;
    label: string;
    classNameExtra?: string;
    type?: "submit" | "reset" | "button";
}
  