export interface Query {
  phrase: string;
}

export const query = ({ phrase }: Query) => {
  console.log(phrase);
};
