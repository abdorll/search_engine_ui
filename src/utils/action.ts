import { publicAxios } from "./axios"

export const autoComplete = async (query: string) => {
  const res = await publicAxios.get(`autosuggest?prefix=${query}`, {
    timeout: 5000
  }).then((res) => res.data);
  console.log(res)
  if (res.length == 0) return "";
  return res[0];
}