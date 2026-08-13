import React, { useState } from "react";
import { QuotationFormData } from "../types";
import { submitQuotationRequest } from "../api/agentApi";

interface QuotationInputViewProps {
  onSubmitSuccess: (requestId: string, formData: QuotationFormData) => void;
}

export const QuotationInputView: React.FC<QuotationInputViewProps> = ({
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<QuotationFormData>({
    name: "Seoyeon Lee",
    company: "Mirae Auto Parts",
    country: "Korea",
    email: "request22@demo-company22.example",
    phone: "+82-10-0000-0022",
    incoterms: "",
    shippingType: "",
    pol: "BUSAN, KOREA",
    pod: "LOS ANGELES, USA",
    requestDepartureDateTime: "",
    cargoDescription:
      "Lithium-ion battery modules, UN3480 (Door-to-Door).\nClass 9 DG. MSDS, UN38.3 test summary and DG declaration available.\nKeep away from heat. Please propose both direct and transshipment options.",
    containerQty: "4",
    weightKg: "21600",
    cbm: "42.5",
    hsCode: "0000.00.00",
    unNumber: "UNXXXX",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Pre-fill demo data button for smooth demoing
  const fillDemoData = () => {
    setFormData({
      name: "Seoyeon Lee",
      company: "Mirae Auto Parts",
      country: "Korea",
      email: "request22@demo-company22.example",
      phone: "+82-10-0000-0022",
      incoterms: "FOB",
      shippingType: "fcl",
      pol: "BUSAN, KOREA",
      pod: "LOS ANGELES, USA",
      requestDepartureDateTime: "2026-08-25T09:00",
      cargoDescription:
        "Lithium-ion battery modules, UN3480 (Door-to-Door).\nClass 9 DG. MSDS, UN38.3 test summary and DG declaration available.\nKeep away from heat. Please propose both direct and transshipment options.",
      containerQty: "4",
      weightKg: "21600",
      cbm: "42.5",
      hsCode: "8507.60.00",
      unNumber: "UN3480",
    });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const requiredFields: Array<{ key: keyof QuotationFormData; label: string }> = [
      { key: "name", label: "이름" },
      { key: "company", label: "회사명" },
      { key: "country", label: "국가" },
      { key: "email", label: "이메일" },
      { key: "phone", label: "연락처" },
      { key: "incoterms", label: "인코텀즈" },
      { key: "shippingType", label: "운송 유형" },
      { key: "pol", label: "출발항" },
      { key: "pod", label: "도착항" },
      { key: "requestDepartureDateTime", label: "희망 출항일시" },
      { key: "cargoDescription", label: "상세 설명" },
      { key: "containerQty", label: "컨테이너 수량" },
    ];

    requiredFields.forEach(({ key, label }) => {
      const val = formData[key];
      if (val === undefined || val === null || String(val).trim() === "") {
        newErrors[key] = `${label} 항목을 입력해주세요.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuotationRequest(formData);
      onSubmitSuccess(res.requestId, formData);
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "견적 요청 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface p-6 md:p-10 lg:p-12 flex flex-col md:flex-row gap-8 relative">
      <div className="flex-1 flex flex-col gap-8 mx-auto md:mx-0 max-w-5xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-display-sm text-display-sm text-on-surface font-bold">
              해상 견적 요청
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              처리를 위한 물류 요구사항을 제출하십시오.
            </p>
          </div>

          <button
            type="button"
            onClick={fillDemoData}
            className="px-4 py-2 bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 rounded-lg font-body-sm text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              auto_fix_high
            </span>
            예시 데이터 채우기
          </button>
        </div>

        {serverError && (
          <div className="bg-error-container text-on-error-container p-5 rounded-xl flex items-center justify-between border border-error/30 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-2xl">
                error
              </span>
              <span className="font-body-sm font-medium">{serverError}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-error text-on-error rounded-lg font-body-sm text-xs font-bold"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 md:p-10 shadow-sm">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Section 1: Requester Info */}
            <section className="mb-2">
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-6 border-b border-outline-variant pb-3">
                요청자 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    이름 <span className="text-error">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`border ${
                      errors.name ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="Seoyeon Lee"
                    type="text"
                  />
                  {errors.name && (
                    <span className="text-error text-xs font-medium">{errors.name}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    회사명 <span className="text-error">*</span>
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`border ${
                      errors.company ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="Mirae Auto Parts"
                    type="text"
                  />
                  {errors.company && (
                    <span className="text-error text-xs font-medium">{errors.company}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    국가 <span className="text-error">*</span>
                  </label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`border ${
                      errors.country ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="Korea"
                    type="text"
                  />
                  {errors.country && (
                    <span className="text-error text-xs font-medium">{errors.country}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    이메일 <span className="text-error">*</span>
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`border ${
                      errors.email ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="request22@demo-company22.example"
                    type="email"
                  />
                  {errors.email && (
                    <span className="text-error text-xs font-medium">{errors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    연락처 <span className="text-error">*</span>
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`border ${
                      errors.phone ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="+82-10-0000-0022"
                    type="tel"
                  />
                  {errors.phone && (
                    <span className="text-error text-xs font-medium">{errors.phone}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Section 2: General Info */}
            <section className="mb-2">
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-6 border-b border-outline-variant pb-3">
                일반 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    인코텀즈 <span className="text-error">*</span>
                  </label>
                  <select
                    name="incoterms"
                    value={formData.incoterms}
                    onChange={handleChange}
                    className={`border ${
                      errors.incoterms
                        ? "border-error"
                        : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                  >
                    <option value="">인코텀즈 선택</option>
                    <option value="EXW">EXW (공장인도조건)</option>
                    <option value="FCA">FCA (운송인인도조건)</option>
                    <option value="FAS">FAS (선측인도조건)</option>
                    <option value="FOB">FOB (본선인도조건)</option>
                    <option value="CFR">CFR (운임포함인도조건)</option>
                    <option value="CIF">CIF (운임, 보험료 포함 인도조건)</option>
                    <option value="CPT">CPT (운송비지급인도조건)</option>
                    <option value="CIP">CIP (운송비, 보험료 지급 인도조건)</option>
                    <option value="DAP">DAP (도착장소인도조건)</option>
                    <option value="DPU">DPU (도착지양하인도조건)</option>
                    <option value="DDP">DDP (관세지급인도조건)</option>
                  </select>
                  {errors.incoterms && (
                    <span className="text-error text-xs font-medium">
                      {errors.incoterms}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    운송 유형 <span className="text-error">*</span>
                  </label>
                  <select
                    name="shippingType"
                    value={formData.shippingType}
                    onChange={handleChange}
                    className={`border ${
                      errors.shippingType
                        ? "border-error"
                        : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                  >
                    <option value="">유형 선택</option>
                    <option value="fcl">FCL (만재화물)</option>
                    <option value="lcl">LCL (소량화물)</option>
                  </select>
                  {errors.shippingType && (
                    <span className="text-error text-xs font-medium">
                      {errors.shippingType}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    출발항 <span className="text-error">*</span>
                  </label>
                  <input
                    name="pol"
                    value={formData.pol}
                    onChange={handleChange}
                    className={`border ${
                      errors.pol ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="예: 상하이 (CNSHA)"
                    type="text"
                  />
                  {errors.pol && (
                    <span className="text-error text-xs font-medium">{errors.pol}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    도착항 <span className="text-error">*</span>
                  </label>
                  <input
                    name="pod"
                    value={formData.pod}
                    onChange={handleChange}
                    className={`border ${
                      errors.pod ? "border-error" : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="예: 로스앤젤레스 (USLAX)"
                    type="text"
                  />
                  {errors.pod && (
                    <span className="text-error text-xs font-medium">{errors.pod}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    희망 출항일시 <span className="text-error">*</span>
                  </label>
                  <input
                    name="requestDepartureDateTime"
                    value={formData.requestDepartureDateTime}
                    onChange={handleChange}
                    className={`border ${
                      errors.requestDepartureDateTime
                        ? "border-error"
                        : "border-outline-variant"
                    } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                    placeholder="2026-08-25T09:00"
                    type="datetime-local"
                  />
                  {errors.requestDepartureDateTime && (
                    <span className="text-error text-xs font-medium">
                      {errors.requestDepartureDateTime}
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Cargo Info */}
            <section>
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-6 border-b border-outline-variant pb-3">
                화물 설명
              </h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                    상세 설명 <span className="text-error">*</span>
                  </label>
                  <textarea
                    name="cargoDescription"
                    value={formData.cargoDescription}
                    onChange={handleChange}
                    className={`border ${
                      errors.cargoDescription
                        ? "border-error"
                        : "border-outline-variant"
                    } rounded-lg px-4 py-3 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all`}
                    placeholder="Lithium-ion battery modules, UN3480 (Door-to-Door).&#10;Class 9 DG. MSDS, UN38.3 test summary available."
                    rows={4}
                  />
                  {errors.cargoDescription && (
                    <span className="text-error text-xs font-medium">
                      {errors.cargoDescription}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                      컨테이너 수량 <span className="text-error">*</span>
                    </label>
                    <input
                      name="containerQty"
                      value={formData.containerQty}
                      onChange={handleChange}
                      className={`border ${
                        errors.containerQty
                          ? "border-error"
                          : "border-outline-variant"
                      } rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                      placeholder="4"
                      type="number"
                      min={1}
                    />
                    {errors.containerQty && (
                      <span className="text-error text-xs font-medium">
                        {errors.containerQty}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                      중량
                    </label>
                    <div className="relative">
                      <input
                        name="weightKg"
                        value={formData.weightKg || ""}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="21600"
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-on-surface-variant pointer-events-none font-semibold">
                        kg
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                      부피
                    </label>
                    <div className="relative">
                      <input
                        name="cbm"
                        value={formData.cbm || ""}
                        onChange={handleChange}
                        className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="예: 42.5"
                        type="number"
                        step="0.1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-on-surface-variant pointer-events-none font-semibold">
                        CBM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                      HS 코드
                    </label>
                    <input
                      name="hsCode"
                      value={formData.hsCode || ""}
                      onChange={handleChange}
                      className="border border-outline-variant rounded-lg px-4 py-2.5 bg-surface font-label-numeric text-label-numeric focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="0000.00.00"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant font-semibold">
                      UN 번호 (위험물인 경우)
                    </label>
                    <input
                      name="unNumber"
                      value={formData.unNumber || ""}
                      onChange={handleChange}
                      className="border border-outline-variant rounded-lg px-4 py-2.5 bg-surface font-label-numeric text-label-numeric focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="UNXXXX"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant mt-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, pol: "", pod: "" })}
                className="px-5 py-2.5 border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface font-medium hover:bg-surface-container-low transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm font-bold hover:bg-primary-container transition-colors shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>
                    <span>처리 중...</span>
                  </>
                ) : (
                  <>
                    <span>요청 제출</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
