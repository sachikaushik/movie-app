import "toastr/build/toastr.min.css";
import "@/styles/globals.css";
import "@/styles/toastr-custom.css";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
