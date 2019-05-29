Title: VMWare images

# Introduction

MAAS 2.5 and above has the ability to deploy VMware ESXi as a custom image. MAAS cannot directly deploy the VMware ESXi ISO, a specialized image must be created from official VMWare  ISO. Canonical created a [Packer](https://www.packer.io/) template to automate the image creation process.

## Prerequisites (to create the images)

### Image creation

- A physical machine running Ubuntu 18.04+
  - **CPU**: 4 2GHz cores
  - **Memory**: 8 GB RAM (16 GB RAM recommended)
  - **Disk space**: 11 GB
- [The VMWare ESxi ISO](https://my.vmware.com/en/web/vmware/evalcenter?p=free-esxi6)
- [Packer - https://www.packer.io/intro/getting-started/install.html](https://www.packer.io/intro/getting-started/install.html)
  - Procedure was tested with precompiled 64-bit Packer 1.3.4 Linux binaries
- <a class="modal-trigger" href="#esxi-modal">Packer template</a> for MAAS custom image

### Image deployment
- MAAS 2.5.0+

## Customizing the Image

The image may be customized by modifying packer-maas/vmware-esxi/http/vmware-esxi-ks.cfg see Installation and Upgrade Scripts in the [VMware ESXi installation and Setup manual](https://docs.vmware.com/en/VMware-vSphere/6.7/vsphere-esxi-67-installation-setup-guide.pdf) for more information.

## Building an Image

Before an image is built the nbd kernel module must be loaded

```
sudo modprobe nbd
```

Once the nbd kernel module is loaded your current working directory must be in the packer-maas/vmware-esxi directory


```
cd /path/to/packer-maas/vmware-esxi
```

You can now start the image building process using Packer with the following command

```
sudo packer build -var
'vmware_esxi_iso_path=/path/to/VMware-VMvisor-Installer-6.7.0-8169922.x86_64.iso'
vmware-esxi.json
```

## Uploading an Image

Once the image has been created it can be uploaded to MAAS using the CLI with the following command

```
maas $PROFILE boot-resources create name='esxi/6.7' title='VMware ESXi 6.7'
architecture='amd64/generic' filetype='ddgz' content@=vmware-esxi.dd.gz
```

## Features and Limitations

### Networking
- VMware ESXi does not support linux bridges
- Bonds - The following MAAS bond modes are mapped to VMware ESXi NIC team sharing with load balancing as follows:
  - balance-rr - portid
  - active-backup - explicit
  - 802.3ad - iphash, LACP rate and XMIT hash policy settings are ignored.
  - No other bond modes are currently supported.
- VMware ESXi does not allow VMs to use a PortGroup that has a VMK attached to it. All configured devices will have a VMK attached. To use a vSwitch with VMs you must leave a device or alias unconfigured in MAAS.

### Storage

Custom storage configuration is not supported as VMware ESXi has specific requirements for how files are written to the disk. MAAS will extend datastore1 to the full size of the deployment disk. After deployment VMware tools may be used to access the other disks.

### ESXi Hardware Support

VMware has [very specific hardware requirements](https://www.vmware.com/resources/compatibility/search.php). In particular running VMware ESXi is not supported in a virtual machine or MAAS virsh Pod.

<!-- Lead capture form -->
<div class="modal" id="esxi-modal">
  <div class="modal__overlay">
    <div class="modal__body">
      <div class="p-card">
        <div class="row modal-form">
          <div class="col-6">
            <h2>Register to download the ESXi packer-template</h2>
            <p>
              We&rsquo;ll help you get the best from this new feature of MAAS.<br>
              Let us know how we should get in touch.
            </p>
          </div>
          <div class="col-6">
            <form action="https://pages.ubuntu.com/index.php/leadCapture/save" method="post" id="mktoForm_3392" class="marketo-form p-form">
              <div class="p-form__group mktFormReq mktField">
                <label for="FirstName" class="mktoLabel p-form__label" >First Name:</label>
                <div class="p-form__control">
                  <input required id="FirstName" name="FirstName" maxlength="255" type="text" class="mktoField mktoRequired">
                </div>
              </div>
              <div class="p-form__group mktFormReq mktField">
                <label for="LastName" class="mktoLabel p-form__label">Last Name:</label>
                <div class="p-form__control">
                  <input required id="LastName" name="LastName" maxlength="255" type="text" class="mktoField mktoRequired">
                </div>
              </div>
              <div class="p-form__group mktFormReq mktField">
                <label for="Email" class="mktoLabel p-form__label" >Email Address:</label>
                <div class="p-form__control">
                  <input required id="Email" name="Email" maxlength="255" type="email" class="mktoField mktoEmailField  mktoRequired" >
                </div>
              </div>
              <div class="p-form__group mktField">
                <input name="Marketing_opt_in__c" id="Marketing_opt_in__c" type="checkbox" value="yes" class="mktoField">
                <label for="Marketing_opt_in__c" class="mktoLabel p-form__label" >I agree to receive information about Canonical's products and services. (Optional)</label>
                <label for="Marketing_opt_in__c"></label>
              </div>
              <div class="p-form__group mktFormReq mktField">
                <input required  name="Consent_to_Processing__c" id="Consent_to_Processing__c" type="checkbox" value="yes" class="mktoField">
                <label for="Consent_to_Processing__c" class="mktoLabel p-form__label" >I agree to be contacted by Canonical about my experience with ESXi images in MAAS.</label>
                <label for="Consent_to_Processing__c"></label>
              </div>
              <p>In submitting this form, I confirm that I have read and agree to <a href="https://www.ubuntu.com/legal/data-privacy">Canonical&rsquo;s Privacy Notice</a> and <a href="https://www.ubuntu.com/legal/data-privacy/esxi">Privacy Policy</a>.
              <div class="p-form__group mktField">
                <button type="button" class="mktoButton p-button--neutral close-modal">Cancel</button>
                <button type="submit" class="mktoButton p-button--positive">Download template</button>
              </div>
              <input type="hidden" name="formid" class="mktoField" value="3392">
              <input type="hidden" name="formVid" class="mktoField" value="3392">
              <input type="hidden" name="munchkinId" class="mktoField" value="066-EOV-335">
              <input type="hidden" name="download_asset_url" class="mktoField" value="https://assets.ubuntu.com/v1/f8e9fa9d-packer-maas-1.0.2.tar.xz">
              <input type="hidden" name="returnURL" value="">
              <input type="hidden" name="retURL" value="">
            </form>
          </div>
        </div>
        <div class="row modal-success">
          <div class="col-12">
            <h2>Thank you for registering</h2>
            <p>
              <strong>Your download should start automatically</strong>.<br>
              Problems? <a href="https://assets.ubuntu.com/v1/f8e9fa9d-packer-maas-1.0.2.tar.xz" class="no-icon">Download 'ESXi.iso.packer.template'</a>.
            </p>
            <div class="u-align--right large-margin--top">
              <button type="button" class="p-button--neutral u-no-margin--bottom close-modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<style>
  .no-icon:after {
    display: none;
  }
</style>
<script src="https://assets.ubuntu.com/v1/4176b39e-serialize.js"></script>
<script src="https://assets.ubuntu.com/v1/ec520d10-XMLHttpRequest.min.js"></script>
<script src="https://assets.ubuntu.com/v1/6b7597df-event-listener-polyfill.js"></script>
<script>
  var backgroundSubmitHandlerClosure = function(event) {
    event.preventDefault();
    var marketoForm = document.getElementById(event.target.id);
    marketoForm.action = "https://app-sjg.marketo.com/index.php/leadCapture/save2";
    backgroundSubmit(marketoForm);
  }

  var backgroundSubmit = function(marketoForm) {
    var request = new XMLHttpRequest();
    var submitUrl = marketoForm.getAttribute('action');
    var formData = serialize(marketoForm);
    request.open("POST", submitUrl, true);

    //Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Send off the POST request
    request.send(formData);

    request.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        showSuccessMessage();
      }
    });

    // get the download asset if it exists
    var download_asset_url = marketoForm.querySelector('input[name=download_asset_url]');
    if (download_asset_url != null) {
      download_asset_url = download_asset_url.value;
    }

    // deal with the post submit actions
    afterSubmit(download_asset_url);
  }

  /**
  * After submit has happened
  * start download and send the user to the instructions page
  */
  var afterSubmit = function(download_asset_url) {
    // Now start the download
    if (download_asset_url) {
      var downloadLink = document.createElement("a");
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.href = download_asset_url;
      downloadLink.setAttribute("download", download_asset_url);
      downloadLink.setAttribute("target", "_blank");
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  // attach handler to all forms
  let marketoForm = document.querySelectorAll("form[id^=mktoForm]");
  marketoForm.forEach(function(form) {
    form.addEventListener('submit', backgroundSubmitHandlerClosure);
  });

  function showSuccessMessage() {
    document.querySelector(".modal-success").classList.add("modal-success-show");
    document.querySelector(".modal-form").classList.add("modal-form-hide");
  }

  function openModal(event) {
    event.preventDefault();

    var modalId = event.currentTarget.getAttribute("href").split("#")[1];
    var modal = document.getElementById(modalId);

    modal.classList.add("show-modal");
    document.body.classList.add("modal-open");
  }

  function closeModals(event) {
    event.preventDefault();

    var modals = document.querySelectorAll(".modal");

    modals.forEach(function(modal) {
      modal.classList.remove("show-modal");
      document.body.classList.remove("modal-open");
      modal.querySelector(".modal-form").classList.remove("modal-form-hide");
      modal.querySelector(".modal-success").classList.remove("modal-success-show");
      modal.querySelector("#FirstName").value = "";
      modal.querySelector("#LastName").value = "";
      modal.querySelector("#Email").value = "";
      modal.querySelector("#Marketing_opt_in__c").checked = false;
      modal.querySelector("#Consent_to_Processing__c").checked = false;
    });
  }

  function openOnButtonClick() {
    var openModalTriggers = document.querySelectorAll(".modal-trigger");

    openModalTriggers.forEach(function(openModalTrigger) {
      var targetModalId = openModalTrigger.getAttribute("href").split("#")[1];
      var targetModal = document.getElementById(targetModal);
      openModalTrigger.addEventListener("click", openModal);
    });
  }

  function closeOnEsc() {
    var escKeyCode = 27;

    document.addEventListener("keydown", function(e) {
      if (e.keyCode === escKeyCode) {
        closeModals(e);
      }
    });
  }

  function closeOnButtonClick() {
    var closeModalTriggers = document.querySelectorAll(".close-modal");

    closeModalTriggers.forEach(function(closeModalTrigger) {
      closeModalTrigger.addEventListener("click", closeModals);
    });
  }

  function closeOnOverlayClick() {
    var modalOverlay = document.querySelector(".modal__overlay");

    modalOverlay.addEventListener("click", function(e) {
      if (e.target === modalOverlay) {
        closeModals(e);
      }
    });
  }

  function setupEventHandlers() {
    openOnButtonClick();
    closeOnEsc();
    closeOnButtonClick();
    closeOnOverlayClick();
  }

  setupEventHandlers();
</script>
<style>
.modal-open {
  overflow: hidden;
}
.modal {
  display: none;
}
.show-modal {
  display: block;
}
.modal__overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.75);
  z-index: 1;
}
.modal__body {
  width: 90%;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 6rem;
}
.large-margin--top {
  margin-top: 6rem;
}
.modal-success {
  display: none;
}
.modal-success-show {
  display: block;
}
.modal-form-hide {
  display: none;
}
</style>