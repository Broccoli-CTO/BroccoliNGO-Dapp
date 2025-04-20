import {
  FormContainer,
  Content,
  Header,
  Title,
  Description,
  Footer,
  FormGroup,
  Main,
  FormInput,
  FormInputLabel,
  FormTextarea,
  RedAsterisk,
  Button,
  SubmitButton,
} from "@/components/Rescue/Form/Main/Layout";
import YesNoSelection from "../YesNoSection";
import { useMemo, useState } from "react";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import { useGlobalCtx } from "@/hooks/useGlobal";
import { syncMultilang } from "@/shared/api";
import { useI18n } from "@/components/ui/I18nProvider";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const FormRequest: React.FC<Props> = ({ onNext, onPrev }) => {
  const { trans } = useI18n();
  const { refreshProfile } = useGlobalCtx();
  const {
    requestForm,
    setRequestForm,
    isSubmitting,
    handleRescueSubmit,
    isPreviewMode,
  } = useRescueRequestCtx();

  const isFormValid = useMemo(() => {
    return requestForm.suppliesRequest.trim() !== "";
  }, [requestForm]);

  const isNextDisabled = !isFormValid;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextDisabled) return;
    const isSuccess = await handleRescueSubmit();
    if (!isSuccess) return;
    await refreshProfile();
    onNext();
    await syncMultilang();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Main>
        <Header>
          <Title>{trans(_TL_('Funds Request'))}</Title>
          <Description>
            {trans(_TL_("Please describe your situation and the rescue animal's condition in detail. Photos/videos will help us process your request faster."))}
          </Description>
        </Header>
        <Content>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>{trans(_TL_('Supplies request'))}
            </FormInputLabel>
            <FormTextarea
              required
              name="suppliesRequest"
              onChange={handleInputChange}
              value={requestForm.suppliesRequest}
              placeholder={trans(_TL_('What supplies are urgently needed? Specify exact quantities and specifications (e.g. "200kg adult dog food (chicken flavor), 10 sterile vet-grade bandages (5cm width), amoxicillin 250mg x30 tablets, 20kg puppy milk powder (goat milk base)."')) as string}
              disabled={isPreviewMode}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>{trans(_TL_('Additional Info'))}</FormInputLabel>
            <FormTextarea
              name="additionalInfo"
              onChange={handleInputChange}
              value={requestForm.additionalInfo}
              placeholder={trans(_TL_('Please provide any other relevant details (e.g., special requirements, preferred brands, or delivery instructions).')) as string}
              disabled={isPreviewMode}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>{trans(_TL_('Can you provide invoices?'))}
            </FormInputLabel>
            <YesNoSelection
              value={requestForm.canProvideInvoices}
              disabled={isPreviewMode}
              onChange={(bool) => {
                setRequestForm((prev) => ({
                  ...prev,
                  canProvideInvoices: bool,
                }));
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>{trans(_TL_('Are public acknowledgments possible for us (Broccoli Hope Foundation)?'))}
            </FormInputLabel>
            <YesNoSelection
              value={requestForm.canProvidePublicAcknowledgments}
              disabled={isPreviewMode}
              onChange={(bool) => {
                setRequestForm((prev) => ({
                  ...prev,
                  canProvidePublicAcknowledgments: bool,
                }));
              }}
            />
          </FormGroup>
        </Content>
      </Main>
      <Footer>
        <Button disabled={isSubmitting} onClick={onPrev}>
          {trans(_TL_('Prev'))}
        </Button>
        {isPreviewMode ? (
          <Button disabled={isSubmitting} type="button" onClick={onNext}>
            {trans(_TL_('Next'))}
          </Button>
        ) : (
          <SubmitButton
            loading={isSubmitting}
            disabled={isSubmitting}
            type="submit"
          >
            {trans(_TL_('Submit'))}
          </SubmitButton>
        )}
      </Footer>
    </FormContainer>
  );
};

export default FormRequest;
