export class ModelDatabaseFirewallRules {
	CreateDate : Date = null;
	EndIpAddress : string = "";
	Id : number = 0;
	ModifyDate : Date = null;
	Name : string = "";
	StartIpAddress : string = "";
}
export class ModelDopFormula {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DestinationType : string = "";
	DestinationValue : string = "";
	FmNo : number = 0;
	FmStatus : string = "";
	Remark : string = "";
	SourceKey : string = "";
	SourceName : string = "";
	SourceType : string = "";
	SourceValue : string = "";
	UnitName : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopFormulaBranch {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	FmNo : number = 0;
	LocCode : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriod {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	EtlLotNo : string = "";
	IsPos : string = "";
	PeriodNo : number = 0;
	Post : string = "N";
	SumMeterSaleQty : number = 0;
	SumMeterTotalQty : number = 0;
	TimeFinish : string = "";
	TimeStart : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriodCash {
	BrnCode : string = "";
	CashAmt : number = 0;
	CompCode : string = "";
	CouponAmt : number = 0;
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CreditAmt : number = 0;
	DiscAmt : number = 0;
	DocDate : Date | string = null;
	MeterAmt : number = 0;
	PdId : string = "";
	PdName : string = "";
	PeriodNo : number = 0;
	SaleAmt : number = 0;
	TotalAmt : number = 0;
	UnitPrice : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriodCashGl {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	GlAmt : number = 0;
	GlDesc : string = "";
	GlNo : string = "";
	GlType : string = "";
	PeriodNo : number = 0;
	SeqNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriodCashSum {
	BrnCode : string = "";
	CashAmt : number = 0;
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DepositAmt : number = 0;
	DiffAmt : number = 0;
	DocDate : Date | string = null;
	PeriodNo : number = 0;
	RealAmt : number = 0;
	SumCrAmt : number = 0;
	SumDrAmt : number = 0;
	SumSlipAmt : number = 0;
	SumTotalAmt : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriodEmp {
	BrnCode : string = "";
	CompCode : string = "";
	DocDate : Date | string = null;
	EmpCode : string = "";
	EmpName : string = "";
	PeriodNo : number = 0;
	SeqNo : number = 0;
}
export class ModelDopPeriodGl {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GlAccount : string = "";
	GlDesc : string = "";
	GlLock : string = "";
	GlNo : string = "";
	GlSeqNo : number = 0;
	GlSlip : string = "";
	GlStatus : string = "";
	GlType : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriodMeter {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DispId : string = "";
	DispStatus : string = "";
	DocDate : Date | string = null;
	MeterFinish : number = 0;
	MeterMax : number = 0;
	MeterStart : number = 0;
	PdId : string = "";
	PdName : string = "";
	PeriodNo : number = 0;
	PeriodStatus : string = "";
	Remark : string = "";
	RepairAmt : number = 0;
	RepairFinish : number = 0;
	RepairQty : number = 0;
	RepairStart : number = 0;
	SaleAmt : number = 0;
	SaleQty : number = 0;
	TankId : string = "";
	TestAmt : number = 0;
	TestFinish : number = 0;
	TestQty : number = 0;
	TestStart : number = 0;
	TotalQty : number = 0;
	Unitprice : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPeriodTank {
	BeforeQty : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DiffQty : number = 0;
	DocDate : Date | string = null;
	Height : number = 0;
	Hold : string = "";
	HoldReasonDesc : string = "";
	HoldReasonId : string = "";
	IssueQty : number = 0;
	PdId : string = "";
	PdName : string = "";
	PeriodNo : number = 0;
	PeriodStatus : string = "";
	RealQty : number = 0;
	ReceiveQty : number = 0;
	RemainQty : number = 0;
	SaleQty : number = 0;
	TankId : string = "";
	TransferQty : number = 0;
	Unitprice : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	WaterHeight : number = 0;
	WaterQty : number = 0;
	WithdrawQty : number = 0;
}
export class ModelDopPeriodTankSum {
	AdjustQty : number = 0;
	BalanceQty : number = 0;
	BeforeQty : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	IssueQty : number = 0;
	PdId : string = "";
	PdName : string = "";
	PeriodNo : number = 0;
	ReceiveQty : number = 0;
	SaleQty : number = 0;
	TraninQty : number = 0;
	TransferQty : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	WithdrawQty : number = 0;
}
export class ModelDopPos {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	ItemCount : number = 0;
	JsonData : string = "";
	LocCode : string = "";
	PayGroupId : number = 0;
	Period : number = 0;
}
export class ModelDopPosConfig {
	ApiUrl : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDesc : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	PdId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPosLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	ItemCount : number = 0;
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
	PayGroupId : number = 0;
	Period : number = 0;
}
export class ModelDopPostdayDt {
	Amount : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	DocDate : Date | string = null;
	DocFinish : number = 0;
	DocNo : number = 0;
	DocStart : number = 0;
	DocType : string = "";
	LocCode : string = "";
	SeqNo : number = 0;
	Total : number = 0;
	TypeId : number = 0;
	TypeName : string = "";
}
export class ModelDopPostdayHd {
	BrnCode : string = "";
	CashAmt : number = 0;
	ChequeAmt : number = 0;
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DepositAmt : number = 0;
	DiffAmt : number = 0;
	DocDate : Date | string = null;
	EtlLotNo : string = "";
	LocCode : string = "";
	Remark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelDopPostdayLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
}
export class ModelDopPostdaySum {
	BrnCode : string = "";
	CompCode : string = "";
	DocDate : Date | string = null;
	FmNo : number = 0;
	LocCode : string = "";
	Remark : string = "";
	SeqNo : number = 0;
	SumDetail : number = 0;
	SumHead : number = 0;
	UnitName : string = "";
}
export class ModelDopPostdayValidate {
	BrnCode : string = "";
	CompCode : string = "";
	DocDate : Date | string = null;
	LocCode : string = "";
	SeqNo : number = 0;
	ValidRemark : string = "";
	ValidResult : string = "";
}
export class ModelDopValidate {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	Remark : string = "";
	SourceKey : string = "";
	SourceType : string = "";
	SourceValue : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	ValidNo : number = 0;
	ValidStatus : string = "";
}
export class ModelEtlLotHd {
	CreatedDate : Date = null;
	LotNo : string = "";
	LotSource : string = "";
	LotStatus : string = "";
	LotTotal : string = "";
	UpdatedDate : Date = null;
}
export class ModelFinBalance {
	BalanceAmt : number = 0;
	BalanceAmtCur : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	Currency : string = "";
	CustCode : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocType : string = "";
	DueDate : Date = null;
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelFinReceiveDt {
	AccountNo : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemAmt : number = 0;
	ItemAmtCur : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	Remark : string = "";
	SeqNo : number = 0;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelFinReceiveHd {
	AccountNo : string = "";
	BankName : string = "";
	BankNo : string = "";
	BillNo : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustCode : string = "";
	CustName : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EtlLotNo : string = "";
	FeeAmt : number = 0;
	FeeAmtCur : number = 0;
	Guid : string = "8777829f-eaef-4002-b917-f5897e9e0b9e";
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	PayDate : Date = null;
	PayNo : string = "";
	PayType : string = "";
	PayTypeId : string = "";
	Post : string = "N";
	ReceiveType : string = "";
	ReceiveTypeId : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
	WhtAmt : number = 0;
	WhtAmtCur : number = 0;
}
export class ModelFinReceiveLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
}
export class ModelFinReceivePay {
	BillBrnCode : string = "";
	BillNo : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemType : string = "";
	LocCode : string = "";
	PayAmt : number = 0;
	RemainAmt : number = 0;
	SeqNo : number = 0;
	TxAmt : number = 0;
	TxBalance : number = 0;
	TxBrnCode : string = "";
	TxDate : Date = null;
	TxNo : string = "";
}
export class ModelInfPoConfirmation {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DelivItem : number = 0;
	DelivNumb : string = "";
	EndDate : Date = null;
	ErrorMsg : string = "";
	InfStatus : string = "";
	IsDeleted : string = "";
	PoItem : string = "";
	PoNumber : string = "";
	StartDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInfPoHeader {
	CompCode : string = "";
	CreatDate : Date = null;
	CreatedBy : string = "";
	CreatedBy1 : string = "";
	CreatedDate1 : Date = null;
	Currency : string = "";
	DeleteInd : string = "";
	DocDate : Date | string = null;
	DocType : string = "";
	DownpayAmount : number = 0;
	DownpayDuedate : Date = null;
	DownpayPercent : number = 0;
	DownpayType : string = "";
	EndDate : Date = null;
	ErrorMsg : string = "";
	InfStatus : string = "";
	IsDeleted : string = "";
	Pmnttrms : string = "";
	PoNumber : string = "";
	PurGroup : string = "";
	PurchOrg : string = "";
	ReceiveBrnCode : string = "";
	ReceiveDocNo : string = "";
	ReceiveLocCode : string = "";
	ReceiveStatus : string = "";
	ReceiveUpdate : Date = null;
	RetentionPercentage : number = 0;
	RetentionType : string = "";
	StartDate : Date = null;
	Status : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	Vendor : string = "";
}
export class ModelInfPoItem {
	Acctasscat : string = "";
	Building : string = "";
	COName : string = "";
	City : string = "";
	CityNo : string = "";
	Country : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DelDatcatExt : string = "";
	DeleteInd : string = "";
	DelivTime : string = "";
	DeliveryDate : Date = null;
	District : string = "";
	DownpayAmount : number = 0;
	DownpayDuedate : Date = null;
	DownpayPercent : number = 0;
	EMail : string = "";
	EndDate : Date = null;
	ErrorMsg : string = "";
	Floor : string = "";
	FreeItem : string = "";
	HouseNo : string = "";
	InfStatus : string = "";
	InfoRec : string = "";
	IsDeleted : string = "";
	ItemCat : string = "";
	Langu : string = "";
	Location : string = "";
	Material : string = "";
	MatlGroup : string = "";
	Name : string = "";
	Name2 : string = "";
	Name3 : string = "";
	Name4 : string = "";
	NetPrice : number = 0;
	NoMoreGr : string = "";
	OrderprUn : string = "";
	OverDlvTol : number = 0;
	PlanDel : number = 0;
	Plant : string = "";
	PoDate : Date = null;
	PoItem : string = "";
	PoItem1 : string = "";
	PoItem2 : string = "";
	PoNumber : string = "";
	PoUnit : string = "";
	PostlCod1 : string = "";
	PostlCod2 : string = "";
	PreqItem : string = "";
	PreqItem2 : string = "";
	PreqNo : string = "";
	PriceUnit : number = 0;
	Quantity : number = 0;
	ReceiveFloor : number = 0;
	ReceiveQty : number = 0;
	ReceiveUpdate : Date = null;
	Region : string = "";
	RetItem : string = "";
	RetentionPercentage : number = 0;
	RfqItem : string = "";
	RoomNo : string = "";
	SchedLine : string = "";
	ShortText : string = "";
	Sort1 : string = "";
	Sort2 : string = "";
	StartDate : Date = null;
	StatDate : Date = null;
	StgeLoc : string = "";
	StrSuppl1 : string = "";
	StrSuppl2 : string = "";
	Street : string = "";
	StreetNo : string = "";
	TaxCode : string = "";
	Transpzone : string = "";
	UnderDlvTol : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	ValType : string = "";
}
export class ModelInfPoType {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	PoTypeDesc : string = "";
	PoTypeId : string = "";
	PoTypeRemark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInfPosFunction14 {
	Amount : number = 0;
	BranchAt : string = "";
	Bstatus : string = "";
	BusinessDate : Date = null;
	CardNo : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	InsertTimestamp : string = "";
	JournalId : string = "";
	MopCode : string = "";
	MopInfo : string = "";
	Pono : string = "";
	PosId : number = 0;
	PosName : string = "";
	ShiftDesc : string = "";
	ShiftId : number = 0;
	ShiftNo : string = "";
	SiteId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInfPosFunction2 {
	BusinessDate : Date = null;
	CloseMeterValue : number = 0;
	CloseMeterVolume : number = 0;
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GradeId : string = "";
	GradeName : string = "";
	GradeName2 : string = "";
	HoseId : number = 0;
	OpenMeterValue : number = 0;
	OpenMeterVolume : number = 0;
	PosId : number = 0;
	PosName : string = "";
	PumpId : number = 0;
	ShiftDesc : string = "";
	ShiftId : number = 0;
	ShiftNo : string = "";
	SiteId : string = "";
	TotalValue : number = 0;
	TotalVolume : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInfPosFunction4 {
	Billno : string = "";
	BusinessDate : Date = null;
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CustomerId : string = "";
	JournalDate : Date = null;
	JournalId : string = "";
	JournalStatus : string = "";
	LicNo : string = "";
	MaxCardNumber : string = "";
	Miles : string = "";
	PosId : number = 0;
	ShiftId : number = 0;
	ShiftNo : string = "";
	SiteId : string = "";
	Taxinvno : string = "";
	TotalDiscamt : number = 0;
	TotalGoodsamt : number = 0;
	TotalPaidAmt : number = 0;
	TotalTaxamt : number = 0;
	TransNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	UserCardNo : string = "";
	UserId : string = "";
	Username : string = "";
}
export class ModelInfPosFunction5 {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DeliveryId : number = 0;
	DeliveryType : number = 0;
	DiscAmt : number = 0;
	DiscGroup : string = "";
	GoodsAmt : number = 0;
	HoseId : number = 0;
	ItemCode : string = "";
	ItemName : string = "";
	ItemType : string = "";
	JournalId : string = "";
	PluNumber : string = "";
	PosId : number = 0;
	ProductCodesap : string = "";
	PumpId : number = 0;
	Runno : number = 0;
	SellPrice : number = 0;
	SellQty : number = 0;
	ShiftId : number = 0;
	TankId : number = 0;
	TaxAmt : number = 0;
	TaxRate : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvAdjustDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	DocType : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefQty : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	UnitBarcode : string = "";
	UnitCost : number = 0;
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
}
export class ModelInvAdjustHd {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnNameFrom : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "6df1c2f4-30be-418c-8005-271691f21a5c";
	LocCode : string = "";
	Post : string = "N";
	ReasonDesc : string = "";
	ReasonId : string = "";
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvAdjustRequestDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	StockQty : number = 0;
	StockRemain : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvAdjustRequestHd {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	Guid : string = "adcfc8f7-e630-47f2-af4e-906b67308be1";
	LocCode : string = "";
	Post : string = "N";
	ReasonDesc : string = "";
	ReasonId : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvAuditDt {
	AdjustQty : number = 0;
	BalanceQty : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	DiffQty : number = 0;
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	NoadjQty : number = 0;
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	UnitBarcode : string = "";
	UnitCost : number = 0;
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
}
export class ModelInvAuditHd {
	AuditSeq : number = 0;
	AuditYear : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "acd6c89a-0cbb-4def-a147-d1c5703bee9c";
	LocCode : string = "";
	Post : string = "N";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvDeliveryCtrl {
	BrnCode : string = "";
	CarNo : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CtrlApi : string = "";
	CtrlApiDesc : string = "";
	CtrlCorrect : string = "";
	CtrlCorrectOther : string = "";
	CtrlCorrectReasonDesc : string = "";
	CtrlCorrectReasonId : string = "";
	CtrlDoc : string = "";
	CtrlDocDesc : string = "";
	CtrlEthanol : string = "";
	CtrlFull : string = "";
	CtrlFullContact : string = "";
	CtrlFullLt : number = 0;
	CtrlFullMm : number = 0;
	CtrlOntime : string = "";
	CtrlOntimeLate : number = 0;
	CtrlSeal : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "92c06e4d-58aa-4886-b21b-d9e49a27c61f";
	LicensePlate : string = "";
	LocCode : string = "";
	Post : string = "N";
	RealDate : Date = null;
	ReceiveNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	WhId : string = "";
	WhName : string = "";
}
export class ModelInvDeliveryCtrlDt {
	BrnCode : string = "";
	CompCode : string = "";
	CtrlApi : string = "";
	CtrlApiDesc : string = "";
	CtrlApiFinish : number = 0;
	CtrlApiStart : number = 0;
	CtrlEthanol : string = "";
	CtrlEthanolQty : number = 0;
	CtrlFull : string = "";
	CtrlFullContact : string = "";
	CtrlFullLt : number = 0;
	CtrlFullMm : number = 0;
	DocNo : string = "";
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
}
export class ModelInvDeliveryCtrlHd {
	BrnCode : string = "";
	CarNo : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CtrlCorrect : string = "";
	CtrlCorrectOther : string = "";
	CtrlCorrectReasonDesc : string = "";
	CtrlCorrectReasonId : string = "";
	CtrlDoc : string = "";
	CtrlDocDesc : string = "";
	CtrlOntime : string = "";
	CtrlOntimeLate : number = 0;
	CtrlSeal : string = "";
	CtrlSealFinish : number = 0;
	CtrlSealStart : number = 0;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "eb663b32-7318-415a-a784-fe228592aa04";
	LicensePlate : string = "";
	LocCode : string = "";
	Post : string = "N";
	RealDate : Date = null;
	ReceiveNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	WhId : string = "";
	WhName : string = "";
}
export class ModelInvReceiveProdDt {
	BrnCode : string = "";
	CompCode : string = "";
	Density : number = 0;
	DensityBase : number = 0;
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscHdAmt : number = 0;
	DiscHdAmtCur : number = 0;
	DocNo : string = "";
	DocType : string = "";
	IsFree : boolean = false;
	ItemQty : number = 0;
	ItemRemain : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	PoQty : number = 0;
	ReturnQty : number = 0;
	ReturnStock : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	StockRemain : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	SumItemAmt : number = 0;
	SumItemAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	Temperature : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
	UnitPriceCur : number = 0;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
	WeightPrice : number = 0;
	WeightQty : number = 0;
}
export class ModelInvReceiveProdHd {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CurRate : number = 0;
	Currency : string = "";
	DeliveryNo : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscRate : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	DueDate : Date = null;
	EtaxAmt : number = 0;
	EtaxAmtCur : number = 0;
	Guid : string = "090d0902-685d-44a9-a509-23b943d42318";
	InvAddrId : string = "";
	InvAddress : string = "";
	InvDate : Date = null;
	InvNo : string = "";
	ItemCount : number = 0;
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	PayAddrId : string = "";
	PayAddress : string = "";
	PoDate : Date = null;
	PoNo : string = "";
	PoTypeId : string = "";
	Post : string = "N";
	Remark : string = "";
	RunNumber : number = 0;
	ShippingAmt : number = 0;
	ShippingAmtCur : number = 0;
	Source : string = "";
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	SupCode : string = "";
	SupName : string = "";
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelInvReceiveProdLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
	LogStatus : string = "";
	Remark : string = "";
}
export class ModelInvRequestDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	DocTypeId : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	StockQty : number = 0;
	StockRemain : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvRequestHd {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnCodeTo : string = "";
	BrnNameFrom : string = "";
	BrnNameTo : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocTypeId : string = "";
	Guid : string = "ee5f808d-51b0-4f2d-8972-1fc378be043f";
	LocCode : string = "";
	Post : string = "N";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvReturnOilDt {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnNameFrom : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefQty : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvReturnOilHd {
	BrnCode : string = "";
	BrnCodeTo : string = "";
	BrnNameTo : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	Guid : string = "7a3e9705-2bdd-4433-98bc-ae5f9e8fbde1";
	LocCode : string = "";
	PoNo : string = "";
	Post : string = "N";
	ReasonDesc : string = "";
	ReasonId : string = "";
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvReturnSupDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefQty : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvReturnSupHd {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	Guid : string = "f7bc63bd-fa24-4fdb-9ae4-9cec02b5da08";
	LocCode : string = "";
	PoNo : string = "";
	Post : string = "N";
	ReasonDesc : string = "";
	ReasonId : string = "";
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	SupCode : string = "";
	SupName : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvStockDaily {
	Adjust : number = 0;
	Audit : number = 0;
	Balance : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	FreeOut : number = 0;
	LocCode : string = "";
	PdId : string = "";
	ReceiveIn : number = 0;
	Remain : number = 0;
	ReturnOut : number = 0;
	SaleOut : number = 0;
	StockDate : Date = null;
	TransferIn : number = 0;
	TransferOut : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	WithdrawOut : number = 0;
}
export class ModelInvStockMonthly {
	Balance : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	LocCode : string = "";
	MonthNo : number = 0;
	PdId : string = "";
	UnitBarcode : string = "";
	UnitId : string = "";
	YearNo : number = 0;
}
export class ModelInvSupplyRequestDt {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnNameFrom : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefNo : string = "";
	RefQty : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	StockRemain : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvSupplyRequestHd {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnNameFrom : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "a36f6cd3-abf3-46d5-b722-b0ca836b54eb";
	LocCode : string = "";
	Post : string = "N";
	Remark : string = "";
	RequestDate : Date = null;
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvTraninDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	StockQty : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvTraninHd {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnNameFrom : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	Guid : string = "6ee76ec5-98bc-49eb-944d-9584b8d56bcf";
	LocCode : string = "";
	Post : string = "N";
	RefDate : Date = null;
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvTranoutDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefQty : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	StockRemain : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvTranoutHd {
	BrnCode : string = "";
	BrnCodeTo : string = "";
	BrnNameTo : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	Guid : string = "4ddd3c77-b50e-4e43-8ef1-df6b1ba8efeb";
	LocCode : string = "";
	Post : string = "N";
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvTranoutLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
}
export class ModelInvUnuseDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	StockQty : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvUnuseHd {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	Guid : string = "961d8758-cf66-43f7-b197-5a001d105ed0";
	LocCode : string = "";
	Post : string = "N";
	ReasonDesc : string = "";
	ReasonId : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelInvWithdrawDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	StockQty : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
}
export class ModelInvWithdrawHd {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "9d9ac942-f66b-4969-843f-b01ef7cd972d";
	LicensePlate : string = "";
	LocCode : string = "";
	Post : string = "N";
	ReasonDesc : string = "";
	ReasonId : string = "";
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	UseBrnCode : string = "";
	UseBrnName : string = "";
}
export class ModelInvWithdrawLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
}
export class ModelMasBank {
	AccountNo : string = "";
	BankCode : string = "";
	BankName : string = "";
	BankStatus : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasBillerInfo {
	ApiKey : string = "";
	BankAccount : string = "";
	BillerId : string = "";
	Business : string = "";
	CompanyCode : string = "";
	CompanyName : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	Prefix : string = "";
	Remark : string = "";
	SecretKey : string = "";
	Suffix : string = "";
	Type : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasBillerInquiryScb {
	Amount : string = "";
	Billerid : string = "";
	Billpaymentref1 : string = "";
	Billpaymentref2 : string = "";
	Billpaymentref3 : string = "";
	Channelcode : string = "";
	Createby : string = "";
	Createdate : Date = null;
	Currencycode : string = "";
	Equivalentamount : string = "";
	Equivalentcurrencycode : string = "";
	Eventcode : string = "";
	Exchangerate : string = "";
	Fasteasyslipnumber : string = "";
	Id : number = 0;
	Partnertransactionid : string = "";
	Payeeaccountnumber : string = "";
	Payeename : string = "";
	Payeeproxyid : string = "";
	Payeeproxytype : string = "";
	Payeraccountnumber : string = "";
	Payername : string = "";
	Payerproxyid : string = "";
	Payerproxytype : string = "";
	Receivingbankcode : string = "";
	Reverseflag : string = "";
	Sendingbankcode : string = "";
	Tepacode : string = "";
	Transactiondateandtime : string = "";
	Transactionid : string = "";
	Transactiontype : string = "";
}
export class ModelMasBillerTransactionActionScb {
	Action : string = "";
	Billerid : string = "";
	Createby : string = "";
	Createdate : Date = null;
	Id : number = 0;
	Subname : string = "";
	Transref : string = "";
	Type : string = "";
	Value : string = "";
}
export class ModelMasBillerTransactionScb {
	Amount : string = "";
	Billerid : string = "";
	Countrycode : string = "";
	Createby : string = "";
	Createdate : Date = null;
	Id : number = 0;
	Receivingbank : string = "";
	Ref1 : string = "";
	Ref2 : string = "";
	Ref3 : string = "";
	Sendingbank : string = "";
	Transdate : string = "";
	Transref : string = "";
	Transtime : string = "";
}
export class ModelBranchDropdown {
	BrnCode : string = "";
	BrnName : string = "";
}

export class ModelMasBranch {
	Address : string = "";
	BranchNo : string = "";
	BrnCode : string = "";
	BrnName : string = "";
	BrnStatus : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CloseDate : Date = null;
	District : string = "";
	Fax : string = "";
	LocCode : string = "";
	MapBrnCode : string = "";
	Phone : string = "";
	Postcode : string = "";
	Province : string = "";
	SubDistrict : string = "";
	PosCount : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	CompanyName: string = "";
}
export class ModelMasBranchCalibrate {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	LevelNo : number = 0;
	LevelUnit : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	TankId : string = "";
	TankQty : number = 0;
	TankStart : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasBranchConfig {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	IsLockMeter : string = "";
	IsPos : string = "";
	ReportTaxType : string = "";
	Trader : string = "";
	TraderPosition : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasBranchDisp {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DispId : string = "";
	DispStatus : string = "";
	HoseId : number = 0;
	MeterMax : number = 0;
	PdId : string = "";
	PdName : string = "";
	SerialNo : string = "";
	TankId : string = "";
	UnitBarcode : string = "";
	UnitId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasBranchMid {
	BrnCode : string = "";
	CompCode : string = "";
	CreateDate : Date = null;
	CreateUser : string = "";
	MidNo : string = "";
	UpdateDate : Date = null;
	UpdateUser : string = "";
}
export class ModelMasBranchPeriod {
	BrnCode : string = "";
	CompCode : string = "";
	PeriodNo : number = 0;
	TimeFinish : string = "";
	TimeStart : string = "";
}
export class ModelMasBranchTank {
	BrnCode : string = "";
	Capacity : number = 0;
	CapacityMin : number = 0;
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	PdId : string = "";
	PdName : string = "";
	TankId : string = "";
	TankStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasBranchTax {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	TaxAmt : number = 0;
	TaxId : string = "";
	TaxName : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasCenterLog {
	Body : string = "";
	CreatedDate : Date = null;
	Id : string = "a3ec6631-c651-4d19-882f-1d3fb8cea4e4";
	Ipaddress : string = "";
	Method : string = "";
	Path : string = "";
	Type : string = "";
}
export class ModelMasCode {
	Code : string = "";
	CodeDesc : string = "";
	CodeId : string = "617a1e5b-f2b4-40e5-beea-6b61c5335f05";
	CodeType : string = "";
}
export class ModelMasCompany {
	Address : string = "";
	CompCode : string = "";
	CompImage : string = "";
	CompName : string = "";
	CompSataus : string = "";
	CompSname : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CustCode : string = "";
	District : string = "";
	Fax : string = "";
	MapCompCode : string = "";
	Phone : string = "";
	Postcode : string = "";
	Province : string = "";
	RegisterId : string = "";
	SubDistrict : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasCompanyCar {
	CarRemark : string = "";
	CarStatus : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	LicensePlate : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasCompanyMapping {
	ComLegCode : string = "";
	CompanyCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasControl {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CtrlCode : string = "";
	CtrlValue : string = "";
	LocCode : string = "";
	Remark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasCostCenter {
	BrnCode : string = "";
	BrnName : string = "";
	BrnStatus : string = "";
	CompCode : string = "";
	CostCenter : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	MapBrnCode : string = "";
	ProfitCenter : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
    Guid: string;
}
export class ModelMasCustomer {
	AccountId : string = "";
	Address : string = "";
	BillType : string = "";
	BrnCode : string = "";
	CitizenId : string = "";
	CompCode : string = "";
	ContactName : string = "";
	CountryCode : string = "";
	CountryName : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CreditLimit : number = 0;
	CreditTerm : number = 0;
	CustCode : string = "";
	CustName : string = "";
	CustPrefix : string = "";
	CustStatus : string = "";
	District : string = "";
	DueType : string = "";
	Fax : string = "";
	MapCustCode : string = "";
	Phone : string = "";
	Postcode : string = "";
	ProvCode : string = "";
	ProvName : string = "";
	SubDistrict : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	CustAddr1: string;
	CustAddr2: string;
}
export class ModelMasCustomerCar {
	CarStatus : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CustCode : string = "";
	LicensePlate : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasDensity {
	CalculateType : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DensityBase : number = 0;
	DensityDesc : string = "";
	StartDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasDocPattern {
	DocId : string = "";
	DocType : string = "";
	Pattern : string = "";
}
export class ModelMasDocPatternDt {
	DocCode : string = "";
	DocId : string = "";
	DocValue : string = "";
	ItemId : string = "9417d537-1df5-4a09-bbca-089954c24c33";
	SeqNo : number = 0;
}
export class ModelMasDocumentType {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocTypeDesc : string = "";
	DocTypeId : string = "";
	DocTypeName : string = "";
	DocTypeStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasEmployee {
	BirthDate : Date = null;
	BkAccount : string = "";
	BkCode : string = "";
	BkName : string = "";
	CitizenId : string = "";
	CodeDev : string = "";
	DepartDate : Date = null;
	Dteupd : Date = null;
	EmpCode : string = "";
	EmployDate : Date = null;
	EmptypeCode : string = "";
	EmptypeDescThai : string = "";
	Gender : string = "";
	JlCode : number = 0;
	JlDescThai : string = "";
	Mstatus : string = "";
	OrgnameThai : string = "";
	PersonFnameEng : string = "";
	PersonFnameThai : string = "";
	PersonLnameEng : string = "";
	PersonLnameThai : string = "";
	PlCode : string = "";
	PlDescTha : string = "";
	PositionCode : string = "";
	PostnameThai : string = "";
	PrefixEng : string = "";
	PrefixThai : string = "";
	ProbationEndDate : Date = null;
	SocialSecurityId : string = "";
	TaxId : string = "";
	WorkStatus : string = "";
	WorkplaceThai : string = "";
}
export class ModelMasEmployeeLevel {
	BrnCode : string = "";
	BrnName : string = "";
	CompanycodeLevel1 : string = "";
	CompanycodeLevel2 : string = "";
	CompanycodeLevel3 : string = "";
	CompanycodeLevel4 : string = "";
	CompanycodeLevel5 : string = "";
	CompanycodeLevel6 : string = "";
	CompanycodeLevel7 : string = "";
	CompanynameLevel1 : string = "";
	CompanynameLevel2 : string = "";
	CompanynameLevel3 : string = "";
	CompanynameLevel4 : string = "";
	CompanynameLevel5 : string = "";
	CompanynameLevel6 : string = "";
	CompanynameLevel7 : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	EmpEmail : string = "";
	EmpId : string = "";
	EmpLastnameEn : string = "";
	EmpLastnameTh : string = "";
	EmpNameEn : string = "";
	EmpNameTh : string = "";
	EmpSex : string = "";
	EmpTitle : string = "";
	Head1Id : string = "";
	Head1LastnameEn : string = "";
	Head1LastnameTh : string = "";
	Head1NameEn : string = "";
	Head1NameTh : string = "";
	Head2Id : string = "";
	Head2LastnameEn : string = "";
	Head2LastnameTh : string = "";
	Head2NameEn : string = "";
	Head2NameTh : string = "";
	Head3Id : string = "";
	Head3LastnameEn : string = "";
	Head3LastnameTh : string = "";
	Head3NameEn : string = "";
	Head3NameTh : string = "";
	LocCode : string = "";
	LocName : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasGl {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GlAccount : string = "";
	GlDesc : string = "";
	GlNo : string = "";
	GlStatus : string = "";
	GlType : string = "";
	SeqNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasGlMap {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GlNo : string = "";
	MopCode : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasMapping {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	MapDesc : string = "";
	MapId : string = "";
	MapStatus : string = "";
	MapValue : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasPosition {
	PositionCode : string = "";
	PositionStatus : Date = null;
	PositionDesc : string = "";
	PositionName : string = "";
	Guid : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasOrganize {
	MpPlant : string = "";
	OrgCode : string = "";
	OrgCodedev : string = "";
	OrgComp : string = "";
	OrgName : string = "";
	OrgShopid : string = "";
	StatPosMart : string = "";
}
export class ModelAuthBranch {
	BrnCode : string = "";
	BrnName : string = "";
}
export class ModelMasPayGroup {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	PayGroupId : number = 0;
	PayGroupName : string = "";
	PayGroupRemark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasPayType {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	PayGroupId : number = 0;
	PayTypeId : number = 0;
	PayTypeName : string = "";
	PayTypeRemark : string = "";
	PayTypeStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasPayTypeDt {
	PayCode : string = "";
	PayName : string = "";
	PayTypeId : number = 0;
}
export class ModelMasProduct {
	AcctCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GroupId : string = "";
	MapPdId : string = "";
	PdDesc : string = "";
	PdId : string = "";
	PdImage : string = "";
	PdName : string = "";
	PdStatus : string = "";
	PdType : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatRate : number = 0;
	VatType : string = "";
  Guid : string = "3efe646c-85a7-469e-b3c6-2d255b4fb48d";
}
export class ModelMasProductGroup {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GroupId : string = "";
	GroupName : string = "";
	GroupStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasProductPrice {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	LocCode : string = "";
	PdId : string = "";
	PdStatus : string = "";
	UnitBarcode : string = "";
	UnitId : string = "";
	Unitprice : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasProductType {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocTypeId : string = "";
	GroupId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasProductUnit {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	PdId : string = "";
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitRatio : number = 0;
	UnitStock : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasReason {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	IsValidate : string = "";
	ReasonDesc : string = "";
	ReasonGroup : string = "";
	ReasonId : string = "";
	ReasonStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasReasonGroup {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	GroupId : string = "";
	ReasonGroup : string = "";
	ReasonId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasSapCustomer {
	BillingCust : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CustomerName : string = "";
	LegCode : string = "";
	SapAltCode : string = "";
	SapCode : string = "";
	SrcName : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasSapPlant {
	BusinessArea : string = "";
	BusinessPlace : string = "";
	Cca : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	Description : string = "";
	IsDeleted : string = "";
	Kokrs : string = "";
	LegCode : string = "";
	Pca : string = "";
	PccaCode : string = "";
	Plant : string = "";
	PlantName : string = "";
	SrcName : string = "";
	TextCsksGsber : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasSupplier {
	Address : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CreditTerm : number = 0;
	District : string = "";
	Fax : string = "";
	MapSupCode : string = "";
	Phone : string = "";
	Postcode : string = "";
	Province : string = "";
	Remark : string = "";
	SubDistrict : string = "";
	SupCode : string = "";
	SupName : string = "";
	SupPrefix : string = "";
	SupStatus : string = "";
	TaxId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatType : string = "";
  Guid : string = "3efe646c-85a7-469e-b3c6-2d255b4fb48d";
}
export class ModelMasSupplierPay {
	CompCode : string = "";
	PayAddrId : string = "";
	SupCode : string = "";
	TaxAddrId : string = "";
}
export class ModelMasSupplierProduct {
	CompCode : string = "";
	SupCode : string = "";
	UnitBarcode : string = "";
	UnitCost : number = 0;
	UnitPack : number = 0;
	UnitPrice : number = 0;
}
export class ModelMasToken {
	AccountName : string = "";
	BranchName : string = "";
	Email : string = "";
	Mid : string = "";
	SapCode : string = "";
	Status : string = "";
	Token : string = "";
}
export class ModelMasUnit {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	MapUnitId : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasUtf8 {
	ThCode : string = "";
	UtfCode : string = "";
}
export class ModelMasWarehouse {
	Address : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	District : string = "";
	Fax : string = "";
	MapWhCode : string = "";
	Phone : string = "";
	Postcode : string = "";
	Province : string = "";
	SubDistrict : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	WhCode : string = "";
	WhName : string = "";
	WhStatus : string = "";
}
export class ModelOilPromotionPriceDt {
	AdjustPrice : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	PdId : string = "";
	UnitBarcode : string = "";
}
export class ModelOilPromotionPriceHd {
	ApproveDate : Date = null;
	ApproveStatus : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocStatus : string = "New";
	FinishDate : Date = null;
	Guid : string = "3efe646c-85a7-469e-b3c6-2d255b4fb48d";
	Remark : string = "";
	StartDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelOilStandardPriceDt {
	AdjustPrice : number = 0;
	BeforePrice : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CurrentPrice : number = 0;
	DocNo : string = "";
	PdId : string = "";
	UnitBarcode : string = "";
}
export class ModelOilStandardPriceHd {
	ApproveDate : Date = null;
	ApproveStatus : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	EffectiveDate : Date = null;
	Guid : string = "1f709f85-4fd7-49cb-88c0-75eb9a66ac9e";
	Remark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelPriNonoilDt {
	AdjustPrice : number = 0;
	BeforePrice : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	CurrentPrice : number = 0;
	DocNo : string = "";
	PdId : string = "";
	UnitBarcode : string = "";
}
export class ModelPriNonoilHd {
	ApproveDate : Date = null;
	ApproveStatus : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocStatus : string = "New";
	EffectiveDate : Date = null;
	Guid : string = "37083cb0-a25c-4172-b917-bbcffc65f94d";
	Remark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelPriOilStandardDt {
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	CompCode : string = "";
	DocNo : string = "";
	JsonData : string = "";
	SeqNo : number = 0;
}
export class ModelPriOilStandardHd {
	ApproveDate : Date = null;
	ApproveStatus : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	EffectiveDate : Date = null;
	Guid : string = "030bace7-6f66-4dd2-8543-8425a0a97e0a";
	Remark : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSalBillingDt {
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	LocCode : string = "";
	SeqNo : number = 0;
	TxAmt : number = 0;
	TxAmtCur : number = 0;
	TxBrnCode : string = "";
	TxDate : Date = null;
	TxNo : string = "";
	TxType : string = "";
}
export class ModelSalBillingHd {
	BrnCode : string = "";
	CitizenId : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CreditLimit : number = 0;
	CreditTerm : number = 0;
	CurRate : number = 0;
	Currency : string = "";
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustCode : string = "";
	CustName : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DueDate : Date = null;
	DueType : string = "";
	Guid : string = "e5bd53d1-4b16-4b15-b482-d8361496d2fc";
	ItemCount : number = 0;
	LocCode : string = "";
	Post : string = "N";
	Remark : string = "";
	RunNumber : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSalCashsaleDt {
	BrnCode : string = "";
	CompCode : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscHdAmt : number = 0;
	DiscHdAmtCur : number = 0;
	DocNo : string = "";
	IsFree : boolean = false;
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefPrice : number = 0;
	RefPriceCur : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	SumItemAmt : number = 0;
	SumItemAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
	UnitPriceCur : number = 0;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelSalCashsaleHd {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CurRate : number = 0;
	Currency : string = "";
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustName : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscRate : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "fffa94ff-c94a-4624-bbc3-7f0a3ad23bb4";
	ItemCount : number = 0;
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	PosNo : string = "";
	Post : string = "N";
	QtNo : string = "";
	RefNo : string = "";
	RunNumber : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
}
export class ModelSalCashsaleLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
	LogStatus : string = "";
	RefNo : string = "";
}
export class ModelSalCndnDt {
	AdjustAmt : number = 0;
	AdjustAmtCur : number = 0;
	AdjustQty : number = 0;
	AfterAmt : number = 0;
	AfterAmtCur : number = 0;
	AfterPrice : number = 0;
	AfterQty : number = 0;
	BeforeAmt : number = 0;
	BeforeAmtCur : number = 0;
	BeforePrice : number = 0;
	BeforeQty : number = 0;
	BrnCode : string = "";
	CompCode : string = "";
	DocNo : string = "";
	DocType : string = "";
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelSalCndnHd {
	BrnCode : string = "";
  CitizenId : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CurRate : number = 0;
	Currency : string = "";
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustCode : string = "";
	CustName : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	Guid : string = "c5349634-a6bf-48a9-b6b8-f7e3b82b6c5b";
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	Post : string = "N";
	PrintBy : string = "";
	PrintCount : number = 0;
	PrintDate : Date = null;
	ReasonDesc : string = "";
	ReasonId : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	TxNo : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
}
export class ModelSalCreditsaleDt {
	BrnCode : string = "";
	CompCode : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscHdAmt : number = 0;
	DiscHdAmtCur : number = 0;
	DocNo : string = "";
	DocType : string = "";
	IsFree : boolean = false;
	ItemQty : number = 0;
	LicensePlate : string = "";
	LocCode : string = "";
	MeterFinish : number = 0;
	MeterStart : number = 0;
	Mile : number = 0;
	PdId : string = "";
	PdName : string = "";
	PoNo : string = "";
	RefPrice : number = 0;
	RefPriceCur : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	SumItemAmt : number = 0;
	SumItemAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
	UnitPriceCur : number = 0;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelSalCreditsaleHd {
	BrnCode : string = "";
	CitizenId : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CurRate : number = 0;
	Currency : string = "";
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustCode : string = "";
	CustName : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscRate : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "d52ee785-622a-486c-9be0-4c884c6d4085";
	ItemCount : number = 0;
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	Period : string = "";
	PosNo : string = "";
	Post : string = "N";
	QtNo : string = "";
	RefNo : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	TxNo : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
}
export class ModelSalCreditsaleLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
	LogStatus : string = "";
	RefNo : string = "";
}
export class ModelSalQuotationDt {
	BrnCode : string = "";
	CompCode : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscHdAmt : number = 0;
	DiscHdAmtCur : number = 0;
	DocNo : string = "";
	IsFree : boolean = false;
	ItemQty : number = 0;
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	RefPrice : number = 0;
	RefPriceCur : number = 0;
	SeqNo : number = 0;
	StockQty : number = 0;
	StockRemain : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	SumItemAmt : number = 0;
	SumItemAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
	UnitPriceCur : number = 0;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelSalQuotationHd {
	ApprCode : string = "";
	BrnCode : string = "";
	BrnCodeFrom : string = "";
	BrnNameFrom : string = "";
	CitizenId : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CurRate : number = 0;
	Currency : string = "";
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustCode : string = "";
	CustName : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscRate : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	EmpCode : string = "";
	EmpName : string = "";
	FinishDate : Date = null;
	Guid : string = "b3373557-112b-436e-81e6-af61697eabb0";
	InvAddr1 : string = "";
	InvAddr2 : string = "";
	InvName : string = "";
	ItemCount : number = 0;
	LocCode : string = "";
	MaxCardId : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	PayCode : string = "";
	PayTypeId : number = 0;
	Phone : string = "";
	PosPrintFlag : string = "";
	PosRewardFlag : string = "";
	Post : string = "N";
	PrintBy : string = "";
	PrintCount : number = 0;
	PrintDate : Date = null;
	Remark : string = "";
	RunNumber : number = 0;
	StartDate : Date = null;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
}
export class ModelSalQuotationLog {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	JsonData : string = "";
	LocCode : string = "";
	LogNo : number = 0;
	LogStatus : string = "";
	RefNo : string = "";
}
export class ModelSalTaxinvoiceDt {
	BrnCode : string = "";
	CompCode : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscHdAmt : number = 0;
	DiscHdAmtCur : number = 0;
	DocNo : string = "";
	IsFree : boolean = false;
	ItemQty : number = 0;
	LicensePlate : string = "";
	LocCode : string = "";
	PdId : string = "";
	PdName : string = "";
	SeqNo : number = 0;
	StockQty : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	SumItemAmt : number = 0;
	SumItemAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UnitBarcode : string = "";
	UnitId : string = "";
	UnitName : string = "";
	UnitPrice : number = 0;
	UnitPriceCur : number = 0;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
	VatType : string = "";
}
export class ModelSalTaxinvoiceHd {
	BrnCode : string = "";
	CitizenId : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	CurRate : number = 0;
	Currency : string = "";
	CustAddr1 : string = "";
	CustAddr2 : string = "";
	CustCode : string = "";
	CustName : string = "";
	DiscAmt : number = 0;
	DiscAmtCur : number = 0;
	DiscRate : string = "";
	DocDate : Date | string = null;
	DocNo : string = "";
	DocPattern : string = "";
	DocStatus : string = "New";
	DocType : string = "";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "215f5aa4-64d8-427e-befa-cc2ba19dea36";
	ItemCount : number = 0;
	LocCode : string = "";
	NetAmt : number = 0;
	NetAmtCur : number = 0;
	Post : string = "N";
	PrintBy : string = "";
	PrintCount : number = 0;
	PrintDate : Date = null;
	RefDocNo : string = "";
	RefNo : string = "";
	RunNumber : number = 0;
	SubAmt : number = 0;
	SubAmtCur : number = 0;
	TaxBaseAmt : number = 0;
	TaxBaseAmtCur : number = 0;
	TotalAmt : number = 0;
	TotalAmtCur : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
	VatAmt : number = 0;
	VatAmtCur : number = 0;
	VatRate : number = 0;
}
export class ModelSysApproveConfig {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocName : string = "";
	DocType : string = "";
	Route : string = "";
	StepCount : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysApproveHd {
	ApprStatus : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	DocNo : string = "";
	Guid : string = "abcb3e2f-9bce-49c6-9b2e-c9045c10e9c7";
	LocCode : string = "";
	Remark : string = "";
	RunNumber : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysApproveStep {
	ApprCode : string = "";
	ApprStatus : string = "";
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocNo : string = "";
	DocType : string = "";
	EmpCode : string = "";
	EmpName : string = "";
	Guid : string = "02f3af93-c51b-4fea-8f26-48ff2abc8b9d";
	LocCode : string = "";
	StepNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysConfigApi {
	ApiDesc : string = "";
	ApiId : string = "";
	ApiUrl : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	Method : string = "";
	SystemId : string = "";
	Topic : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysMenu {
	Child : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	MenuId : string = "";
	MenuName : string = "";
	MenuStatus : string = "";
	Parent : string = "";
	Route : string = "";
	SeqNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysMenuRole {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	MenuId : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysMessage {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	MsgCode : number = 0;
	MsgLang : string = "";
	MsgText : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysNotification {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedBy : string = "";
	CreatedDate : Date = null;
	DocDate : Date | string = null;
	IsRead : string = "";
	Remark : string = "";
	SeqNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysPositionRole {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	IsCancel : string = "";
	IsCreate : string = "";
	IsEdit : string = "";
	IsPrint : string = "";
	IsView : string = "";
	JsonData : string = "";
	MenuId : string = "";
	PositionCode : string = "";
	PostnameThai : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelSysReportConfig {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	ReportGroup : string = "";
	ReportName : string = "";
	ReportStatus : string = "";
	ReportUrl : string = "";
	SeqNo : number = 0;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelTmpBranchPilot {
	BrnCode : string = "";
	CompCode : string = "";
	CreatedDate : Date = null;
	Finance : string = "";
	Inventory : string = "";
	MapCompCode : string = "";
	Meter : string = "";
	MeterDate : Date = null;
	Postday : string = "";
	PostdayDate : Date = null;
	Remark : string = "";
	Sale : string = "";
}
export class ModelTrnScbLog {
	Id : string = "";
}

export class ModelAutEmployeeRole {
	AuthCode : number = 0;
	CreatedBy : string = "";
	CreatedDate : Date = null;
	EmpCode : string = "";
	PositionCode : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
