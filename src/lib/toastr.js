import toastr from "toastr";

toastr.options = {
  positionClass: "toast-top-right",
  timeOut: "3000",
  closeButton: true,
  showDuration: "300",
  hideDuration: "1000",
  extendedTimeOut: "1000",
  progressBar: true,
  preventDuplicates: true,
  newestOnTop: true,
  onclick: null,
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
  tapToDismiss: false,
};

export default toastr;
