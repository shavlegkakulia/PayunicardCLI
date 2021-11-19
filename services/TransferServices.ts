import TemplatesService, {
  IAddTransferTemplateRequest,
} from './TemplatesService';

export const _addTransactionTemplate = (
  data: IAddTransferTemplateRequest,
  startProcessing: (value: boolean) => void,
  endingProcessing: (value: boolean) => void,
  callBack: (value: boolean) => void,
) => {
  startProcessing(true);

  TemplatesService.addTransactionTemplate(data).subscribe({
    next: Response => {
      if (Response.data.ok) {
        callBack(true);
      }
    },
    complete: () => {
      endingProcessing(false);
    },
    error: () => {
      endingProcessing(false);
    },
  });
};
