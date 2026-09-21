package com.shalini.shalinimart;

public class CheckoutRequest {

    private String phone;
    private String address;

    public CheckoutRequest() {
    }

    public CheckoutRequest(String phone, String address) {
        this.phone = phone;
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
