import { CrudOperations } from "@/hooks/useCrudOperations";
import { Job, JobApiResponse, transformJobFromApi } from "@/types/job";
import { JobFormData } from "@/config/form-configs";
import backendApiService from "@/lib/services/backendApiService";

// Job için CRUD operasyonları
export const jobCrudOperations: CrudOperations<
  Job,
  JobFormData,
  Partial<JobFormData>
> = {
  async getAll(): Promise<Job[]> {
    const apiJobs = await backendApiService.getJobs();
    return apiJobs.map(transformJobFromApi);
  },

  async getById(id: string): Promise<Job> {
    const apiJob = (await backendApiService.getJob(id)) as any;
    // transformJobFromApi kullanarak dönüştür
    const jobApiResponse: JobApiResponse = {
      id: apiJob.id,
      title: apiJob.title,
      incotermId: apiJob.incotermId || "",
      incotermName: apiJob.incotermName || "",
      shippingMethodId: apiJob.shippingMethodId || "",
      shippingMethodName: apiJob.shippingMethodName || "",
      loadingPlaceId: apiJob.loadingPlaceId || "",
      loadingPlaceName: apiJob.loadingPlaceName || "",
      portId: apiJob.portId || "",
      portName: apiJob.portName || "",
      loadingDate: apiJob.loadingDate || "",
      loadingStyleId: apiJob.loadingStyleId || "",
      loadingStyleName: apiJob.loadingStyleName || "",
      estimatedAnnualTonnage: apiJob.estimatedAnnualTonnage || "",
      address: apiJob.address || "",
      note: apiJob.note || "",
      ownerCompanyId: apiJob.ownerCompanyId || "",
      ownerCompanyName: apiJob.ownerCompanyName || "",
      createdAt: apiJob.createdAt || "",
    };
    return transformJobFromApi(jobApiResponse);
  },

  async create(data: JobFormData): Promise<Job> {
    // Form data'sını backend API formatına dönüştür
    const apiData = {
      title: data.title,
      incotermId: data.incotermId,
      shippingMethodId: data.shippingMethodId,
      loadingPlaceId: data.loadingPlaceId,
      portId: data.portId,
      loadingDate: data.loadingDate,
      loadingStyleId: data.loadingStyleId,
      estimatedAnnualTonnage: data.estimatedAnnualTonnage,
      address: data.address,
      note: data.note || "",
    };

    const createdJob = await backendApiService.createJob(apiData as any);

    // Backend'den gelen veriyi Job tipine dönüştür
    const createdJobResponse: JobApiResponse = {
      id: (createdJob as any).id,
      title: (createdJob as any).title,
      incotermId: (createdJob as any).incotermId || "",
      incotermName: (createdJob as any).incotermName || "",
      shippingMethodId: (createdJob as any).shippingMethodId || "",
      shippingMethodName: (createdJob as any).shippingMethodName || "",
      loadingPlaceId: (createdJob as any).loadingPlaceId || "",
      loadingPlaceName: (createdJob as any).loadingPlaceName || "",
      portId: (createdJob as any).portId || "",
      portName: (createdJob as any).portName || "",
      loadingDate: (createdJob as any).loadingDate || "",
      loadingStyleId: (createdJob as any).loadingStyleId || "",
      loadingStyleName: (createdJob as any).loadingStyleName || "",
      estimatedAnnualTonnage: (createdJob as any).estimatedAnnualTonnage || "",
      address: (createdJob as any).address || "",
      note: (createdJob as any).note || "",
      ownerCompanyId: (createdJob as any).ownerCompanyId || "",
      ownerCompanyName: (createdJob as any).ownerCompanyName || "",
      createdAt: (createdJob as any).createdAt || "",
    };
    return transformJobFromApi(createdJobResponse);
  },

  async update(id: string, data: Partial<JobFormData>): Promise<Job> {
    // Form data'sını backend API formatına dönüştür
    const apiData: any = {};

    if (data.title !== undefined) apiData.title = data.title;
    if (data.incotermId !== undefined) apiData.incotermId = data.incotermId;
    if (data.shippingMethodId !== undefined)
      apiData.shippingMethodId = data.shippingMethodId;
    if (data.loadingPlaceId !== undefined)
      apiData.loadingPlaceId = data.loadingPlaceId;
    if (data.portId !== undefined) apiData.portId = data.portId;
    if (data.loadingDate !== undefined) apiData.loadingDate = data.loadingDate;
    if (data.loadingStyleId !== undefined)
      apiData.loadingStyleId = data.loadingStyleId;
    if (data.estimatedAnnualTonnage !== undefined)
      apiData.estimatedAnnualTonnage = data.estimatedAnnualTonnage;
    if (data.address !== undefined) apiData.address = data.address;
    if (data.note !== undefined) apiData.note = data.note;

    const updatedJob = await backendApiService.updateJob(id, apiData);

    // Backend'den gelen veriyi Job tipine dönüştür
    const updatedJobResponse: JobApiResponse = {
      id: (updatedJob as any).id,
      title: (updatedJob as any).title,
      incotermId: (updatedJob as any).incotermId || "",
      incotermName: (updatedJob as any).incotermName || "",
      shippingMethodId: (updatedJob as any).shippingMethodId || "",
      shippingMethodName: (updatedJob as any).shippingMethodName || "",
      loadingPlaceId: (updatedJob as any).loadingPlaceId || "",
      loadingPlaceName: (updatedJob as any).loadingPlaceName || "",
      portId: (updatedJob as any).portId || "",
      portName: (updatedJob as any).portName || "",
      loadingDate: (updatedJob as any).loadingDate || "",
      loadingStyleId: (updatedJob as any).loadingStyleId || "",
      loadingStyleName: (updatedJob as any).loadingStyleName || "",
      estimatedAnnualTonnage: (updatedJob as any).estimatedAnnualTonnage || "",
      address: (updatedJob as any).address || "",
      note: (updatedJob as any).note || "",
      ownerCompanyId: (updatedJob as any).ownerCompanyId || "",
      ownerCompanyName: (updatedJob as any).ownerCompanyName || "",
      createdAt: (updatedJob as any).createdAt || "",
    };
    return transformJobFromApi(updatedJobResponse);
  },

  async delete(id: string): Promise<void> {
    await backendApiService.deleteJob(id);
  },
};
