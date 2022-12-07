/**
 * RegisteredClient
 */
class RegisteredClient {
  /**
   * 唯一标识
   */
  id?: number;
  /**
   * 客户端 ID
   */
  clientId?: string;
  /**
   * 客户端秘钥
   */
  clientSecret?: string;
  /**
   * 客户端密码过期时间
   */
  clientSecretExpiresAt?: string;
  /**
   * 客户端名称
   */
  clientName?: string;
  /**
   * 客户端认证方式（client_secret_basic，client_secret_post，private_key_jwt，client_secret_jwt，none）
   */
  clientAuthenticationMethods: string =
    AuthenticationMethodEnum.CLIENT_SECRET_BASIC;
  /**
   * 授权类型（authorization_code,client_credentials,refresh_token,password）
   */
  authorizationGrantTypes?: string | null;
  /**
   * 重定向 URI
   */
  redirectUris?: string;
  /**
   * SCOPE
   */
  scopes?: string;
  /**
   * 是否要求授权许可（1:=是；0:=否）
   */
  requireAuthorizationConsent: number = 1;
  /**
   * 访问令牌有效期（单位：s）
   */
  accessTokenTimeToLive: number = 14400;
  /**
   * 访问令牌格式（self-contained, reference）
   */
  accessTokenFormat: string = "self-contained";
  /**
   * 刷新令牌有效期（单位：s）
   */
  refreshTokenTimeToLive: number = 2592000;
}

class ResetPassForm {
  id?: number;
  clientSecret?: string;
  clientSecretConfirm?: string;
}

/**
 * 授权类型
 */
enum AuthorizationGrantTypeEnum {
  authorization_code = "授权码模式",
  client_credentials = "客户端凭证",
  refresh_token = "刷新令牌",
  password = "密码模式",
}

/**
 * 认证方式
 */
enum AuthenticationMethodEnum {
  CLIENT_SECRET_BASIC = "client_secret_basic",
  CLIENT_SECRET_POST = "client_secret_post",
  PRIVATE_KEY_JWT = "private_key_jwt",
  CLIENT_SECRET_JWT = "client_secret_jwt",
  NONE = "none",
}

export {
  RegisteredClient,
  ResetPassForm,
  AuthorizationGrantTypeEnum,
  AuthenticationMethodEnum,
};
